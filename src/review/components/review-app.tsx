"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { AnnotationBox } from "@/review/components/annotation-box";
import { AnnotationLayer, AnnotationPopover } from "@/review/components/annotation-layer";
import { CommentComposer } from "@/review/components/comment-composer";
import { CommentSidebar } from "@/review/components/comment-sidebar";
import { CommentThread } from "@/review/components/comment-thread";
import { ReviewToolbar } from "@/review/components/review-toolbar";
import { SelectionOverlay } from "@/review/components/selection-overlay";
import { createAnchor, resolveAnchor } from "@/review/lib/annotation-positioning";
import { fetchComments, patchCommentStatus, postComment, postReply } from "@/review/lib/review-api";
import { isReviewTeam, normalizeReviewPathname } from "@/review/lib/review-config";
import { useAnnotationPositions, type AnnotationEntry } from "@/review/lib/use-annotation-positions";
import type {
  AnnotationAnchor,
  DocRect,
  ReviewComment,
  ReviewStatus,
  ReviewTeam,
} from "@/review/types/review";

const TEAM_STORAGE_KEY = "nettle-review:team";
const REFRESH_INTERVAL = 30_000;
const DRAFT_ID = "draft";
// Keep in sync with `.sidebar` width in review.module.css.
const SIDEBAR_WIDTH = 360;

const subscribeNothing = () => () => {};

/** Client-only root: review state lives in the browser, so nothing is server-rendered. */
export function ReviewApp() {
  const isClient = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  return isClient ? <ReviewClient /> : null;
}

// localStorage only remembers the reviewer's team; comments always come from Postgres.
function readStoredTeam(): ReviewTeam | null {
  try {
    const team = window.localStorage.getItem(TEAM_STORAGE_KEY);
    return isReviewTeam(team) ? team : null;
  } catch {
    return null;
  }
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

function ReviewClient() {
  const pathname = normalizeReviewPathname(usePathname() || "/");

  const [expanded, setExpanded] = useState(
    () => new URLSearchParams(window.location.search).get("review") === "true",
  );
  const [team, setTeamState] = useState<ReviewTeam | null>(readStoredTeam);
  const [commentMode, setCommentMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<ReviewStatus>("open");
  const [store, setStore] = useState<{ pathname: string; comments: ReviewComment[] } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dragRect, setDragRect] = useState<DocRect | null>(null);
  // Draft and selection remember their route, so navigating away drops them.
  const [draft, setDraft] = useState<{ pathname: string; anchor: AnnotationAnchor } | null>(null);
  const [selected, setSelected] = useState<{ pathname: string; id: string } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const comments = store?.pathname === pathname ? store.comments : null;
  const activeDraft = draft?.pathname === pathname ? draft : null;
  const selectedId = selected?.pathname === pathname ? selected.id : null;
  const selectedComment = comments?.find((comment) => comment.id === selectedId) ?? null;

  const setTeam = useCallback((next: ReviewTeam) => {
    setTeamState(next);
    try {
      window.localStorage.setItem(TEAM_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the choice lasts for this page view.
    }
  }, []);

  // Load comments for the current route while the tools are open; refresh on focus and periodically.
  useEffect(() => {
    if (!expanded) return;
    let cancelled = false;

    const load = () =>
      fetchComments(pathname)
        .then((result) => {
          if (cancelled) return;
          setStore({ pathname, comments: result });
          setLoadError(null);
        })
        .catch((error: unknown) => {
          if (!cancelled) setLoadError(error instanceof Error ? error.message : "Could not load comments.");
        });

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") load();
    };

    load();
    const interval = window.setInterval(refreshIfVisible, REFRESH_INTERVAL);
    document.addEventListener("visibilitychange", refreshIfVisible);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [expanded, pathname]);

  const upsertComment = useCallback((comment: ReviewComment) => {
    setStore((prev) => {
      if (!prev || prev.pathname !== comment.pathname) return prev;
      const exists = prev.comments.some((item) => item.id === comment.id);
      return {
        pathname: prev.pathname,
        comments: exists
          ? prev.comments.map((item) => (item.id === comment.id ? comment : item))
          : [...prev.comments, comment],
      };
    });
  }, []);

  // Numbers follow creation order and never change when comments are resolved.
  const numbers = useMemo(
    () => new Map((comments ?? []).map((comment, index) => [comment.id, index + 1])),
    [comments],
  );

  const showResolved = sidebarOpen && filter === "resolved";
  const entries = useMemo<AnnotationEntry[]>(() => {
    if (!expanded) return [];
    const list = (comments ?? [])
      .filter((comment) => comment.status === "open" || showResolved || comment.id === selectedId)
      .map((comment) => ({ id: comment.id, anchor: comment.anchor }));
    if (activeDraft) list.push({ id: DRAFT_ID, anchor: activeDraft.anchor });
    return list;
  }, [expanded, comments, showResolved, selectedId, activeDraft]);

  const positions = useAnnotationPositions(entries);

  const closeTools = useCallback(() => {
    setExpanded(false);
    setCommentMode(false);
    setSidebarOpen(false);
    setDraft(null);
    setSelected(null);
    setDragRect(null);
  }, []);

  const handleSelectArea = useCallback(
    (rect: DocRect) => {
      setSelected(null);
      setDraft({ pathname, anchor: createAnchor(rect) });
    },
    [pathname],
  );

  const openComment = useCallback(
    (comment: ReviewComment) => {
      setDraft(null);
      setSelected({ pathname, id: comment.id });

      // Instant, so the thread opens against the final viewport.
      const rect = resolveAnchor(comment.anchor);
      // Leave room for the sticky site header.
      const offset = Math.max(120, window.innerHeight * 0.25);
      window.scrollTo({ top: Math.max(rect.y - offset, 0), behavior: "instant" });
      if (window.innerWidth < 640) setSidebarOpen(false);
    },
    [pathname],
  );

  // Escape: cancel draft → close thread → exit Comment Mode → close sidebar. C: toggle Comment Mode.
  useEffect(() => {
    if (!expanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) return;

      if (event.key === "Escape") {
        if (activeDraft) setDraft(null);
        else if (selectedId) setSelected(null);
        else if (commentMode) setCommentMode(false);
        else if (sidebarOpen) setSidebarOpen(false);
        return;
      }

      if (event.key.toLowerCase() === "c" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setCommentMode((active) => !active);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expanded, activeDraft, selectedId, commentMode, sidebarOpen]);

  const draftPosition = positions[DRAFT_ID];
  const sidebarInset = sidebarOpen ? SIDEBAR_WIDTH : 0;
  const selectedPosition = selectedComment ? positions[selectedComment.id] : undefined;

  return (
    <>
      {expanded && (
        <AnnotationLayer>
          {entries.map((entry) => {
            const comment = comments?.find((item) => item.id === entry.id);
            const position = positions[entry.id];
            if (!comment || !position) return null;

            return (
              <AnnotationBox
                key={comment.id}
                rect={position}
                team={comment.team}
                number={numbers.get(comment.id)}
                variant={comment.status}
                detached={!position.attached}
                hovered={hoveredId === comment.id}
                selected={selectedId === comment.id}
                onHoverChange={(hovered) => setHoveredId(hovered ? comment.id : null)}
                onMarkerClick={() => {
                  setDraft(null);
                  setSelected(selectedId === comment.id ? null : { pathname, id: comment.id });
                }}
              />
            );
          })}

          {dragRect && <AnnotationBox rect={dragRect} team={team} variant="draft" />}

          {activeDraft && draftPosition && (
            <>
              <AnnotationBox
                rect={draftPosition}
                team={team}
                number={(comments?.length ?? 0) + 1}
                variant="draft"
                selected
              />
              <AnnotationPopover key={DRAFT_ID} rect={draftPosition} rightInset={sidebarInset}>
                <CommentComposer
                  number={(comments?.length ?? 0) + 1}
                  team={team}
                  onTeamChange={setTeam}
                  onCancel={() => setDraft(null)}
                  onSubmit={async (author, message) => {
                    const comment = await postComment({
                      pathname,
                      team: author,
                      message,
                      anchor: activeDraft.anchor,
                    });
                    upsertComment(comment);
                    setDraft(null);
                  }}
                />
              </AnnotationPopover>
            </>
          )}

          {selectedComment && selectedPosition && (
            <AnnotationPopover key={selectedComment.id} rect={selectedPosition} rightInset={sidebarInset}>
              <CommentThread
                comment={selectedComment}
                number={numbers.get(selectedComment.id) ?? 0}
                attached={selectedPosition.attached}
                team={team}
                onTeamChange={setTeam}
                onClose={() => setSelected(null)}
                onReply={async (author, message) => {
                  upsertComment(await postReply(selectedComment.id, { team: author, message }));
                }}
                onSetStatus={async (status) => {
                  upsertComment(await patchCommentStatus(selectedComment.id, status));
                }}
              />
            </AnnotationPopover>
          )}
        </AnnotationLayer>
      )}

      {expanded && commentMode && !activeDraft && (
        <SelectionOverlay onDrag={setDragRect} onSelect={handleSelectArea} />
      )}

      {expanded && sidebarOpen && (
        <CommentSidebar
          pathname={pathname}
          comments={comments}
          numbers={numbers}
          error={loadError}
          filter={filter}
          onFilterChange={setFilter}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onHoverChange={setHoveredId}
          onSelect={openComment}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <ReviewToolbar
        expanded={expanded}
        onExpandedChange={(next) => (next ? setExpanded(true) : closeTools())}
        commentMode={commentMode}
        onCommentModeChange={setCommentMode}
        team={team}
        onTeamChange={setTeam}
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={setSidebarOpen}
        openCount={comments ? comments.filter((comment) => comment.status === "open").length : null}
        hasError={loadError !== null}
      />
    </>
  );
}
