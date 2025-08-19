import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useAdmin } from "../contexts/AdminContext";
import type { Comment } from "../services/api";
import { createComment, updateComment, deleteComment } from "../services/api";
import "../css/commentSection.css";

interface CommentSectionProps {
    postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const { userInfo } = useUser();
    const { isLoggedIn } = useAdmin();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null,
    );
    const [editContent, setEditContent] = useState("");
    const [loading, setLoading] = useState(false);

    // 대댓글 관련 상태
    const [replyingToCommentId, setReplyingToCommentId] = useState<
        number | null
    >(null);
    const [replyContent, setReplyContent] = useState("");

    // 댓글 목록 가져오기
    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8080/api/comments/post/${postId}`,
            );
            if (response.ok) {
                const data = await response.json();
                // 댓글 데이터에 닉네임 정보 추가
                const commentsWithNickname = data.map((comment: Comment) => ({
                    ...comment,
                    nickName: comment.nickName || `사용자${comment.userId}`,
                }));
                setComments(commentsWithNickname);
            }
        } catch (error) {
            console.error("댓글을 불러오는 중 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    // 댓글과 대댓글을 계층적으로 정리
    const organizeComments = (comments: Comment[]) => {
        const mainComments = comments.filter((comment) => !comment.isReply);
        const replies = comments.filter((comment) => comment.isReply);

        return mainComments.map((comment) => ({
            ...comment,
            replies: replies.filter(
                (reply) => reply.parentCommentId === comment.id,
            ),
        }));
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    // 댓글 작성
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const commentData = {
                content: newComment.trim(),
                postId: postId,
                userId: userInfo?.pid || 0,
                parentCommentId: undefined,
                isReply: false,
            };

            const response = await createComment(commentData);
            // 응답에 닉네임 정보 추가
            const commentWithNickname = {
                ...response,
                nickName: userInfo?.nickName || "익명",
            };
            setComments((prev) => [commentWithNickname, ...prev]);
            setNewComment("");
        } catch (error) {
            console.error("댓글 작성 중 오류:", error);
            alert("댓글 작성에 실패했습니다.");
        }
    };

    // 댓글 수정 시작
    const handleStartEdit = (comment: Comment) => {
        setEditingCommentId(comment.id!);
        setEditContent(comment.content);
    };

    // 댓글 수정 취소
    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent("");
    };

    // 댓글 수정 저장
    const handleSaveEdit = async (commentId: number) => {
        if (!editContent.trim()) return;

        try {
            await updateComment(commentId, { content: editContent.trim() });
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, content: editContent.trim() }
                        : comment,
                ),
            );
            setEditingCommentId(null);
            setEditContent("");
        } catch (error) {
            console.error("댓글 수정 중 오류:", error);
            alert("댓글 수정에 실패했습니다.");
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            await deleteComment(commentId);
            setComments((prev) =>
                prev.filter((comment) => comment.id !== commentId),
            );
        } catch (error) {
            console.error("댓글 삭제 중 오류:", error);
            alert("댓글 삭제에 실패했습니다.");
        }
    };

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // 권한 체크 (본인 댓글이거나 관리자인 경우)
    const canModifyComment = (comment: Comment) => {
        return userInfo?.pid === comment.userId || isLoggedIn;
    };

    // 대댓글 작성 시작
    const handleStartReply = (commentId: number) => {
        setReplyingToCommentId(commentId);
        setReplyContent("");
    };

    // 대댓글 작성 취소
    const handleCancelReply = () => {
        setReplyingToCommentId(null);
        setReplyContent("");
    };

    // 대댓글 작성
    const handleSubmitReply = async (parentCommentId: number) => {
        if (!replyContent.trim()) return;

        try {
            const replyData = {
                content: replyContent.trim(),
                postId: postId,
                userId: userInfo?.pid || 0,
                parentCommentId: parentCommentId,
                isReply: true,
            };

            const response = await createComment(replyData);
            const replyWithNickname = {
                ...response,
                nickName: userInfo?.nickName || "익명",
            };

            setComments((prev) => [replyWithNickname, ...prev]);
            setReplyingToCommentId(null);
            setReplyContent("");
        } catch (error) {
            console.error("대댓글 작성 중 오류:", error);
            alert("대댓글 작성에 실패했습니다.");
        }
    };

    if (loading) {
        return <div className="comment-loading">댓글을 불러오는 중...</div>;
    }

    return (
        <div className="comment-section">
            <h3 className="comment-title">댓글 ({comments.length})</h3>

            {/* 댓글 작성 폼 */}
            {(userInfo || isLoggedIn) && (
                <form onSubmit={handleSubmitComment} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 작성하세요..."
                        className="comment-input"
                        rows={3}
                        maxLength={500}
                    />
                    <div className="comment-form-footer">
                        <span className="char-counter">
                            {newComment.length}/500
                        </span>
                        <button
                            type="submit"
                            className="comment-submit-btn"
                            disabled={!newComment.trim()}
                        >
                            댓글 작성
                        </button>
                    </div>
                </form>
            )}

            {/* 댓글 목록 */}
            <div className="comment-list">
                {comments.length === 0 ? (
                    <div className="no-comments">아직 댓글이 없습니다.</div>
                ) : (
                    organizeComments(comments).map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <span className="comment-author">
                                    {comment.nickName || "익명"}
                                </span>
                                <span className="comment-date">
                                    {comment.createdAt &&
                                        formatDate(comment.createdAt)}
                                </span>
                            </div>

                            {editingCommentId === comment.id ? (
                                <div className="comment-edit-form">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                        className="comment-edit-input"
                                        rows={3}
                                        maxLength={500}
                                    />
                                    <div className="comment-edit-actions">
                                        <span className="char-counter">
                                            {editContent.length}/500
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleSaveEdit(comment.id!)
                                            }
                                            className="comment-save-btn"
                                            disabled={!editContent.trim()}
                                        >
                                            저장
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="comment-cancel-btn"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="comment-content">
                                    {comment.content}
                                </div>
                            )}

                            {/* 댓글 액션 버튼 */}
                            <div className="comment-actions">
                                {/* 대댓글 버튼 */}
                                <button
                                    onClick={() =>
                                        handleStartReply(comment.id!)
                                    }
                                    className="comment-reply-btn"
                                >
                                    답글
                                </button>

                                {/* 수정/삭제 버튼 (권한이 있는 경우만) */}
                                {canModifyComment(comment) && (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleStartEdit(comment)
                                            }
                                            className="comment-edit-btn"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteComment(comment.id!)
                                            }
                                            className="comment-delete-btn"
                                        >
                                            삭제
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* 대댓글 작성 폼 */}
                            {replyingToCommentId === comment.id && (
                                <div className="comment-reply-form">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) =>
                                            setReplyContent(e.target.value)
                                        }
                                        placeholder="대댓글을 작성하세요..."
                                        className="comment-reply-input"
                                        rows={2}
                                        maxLength={300}
                                    />
                                    <div className="comment-reply-actions">
                                        <span className="char-counter">
                                            {replyContent.length}/300
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleSubmitReply(comment.id!)
                                            }
                                            className="comment-reply-submit-btn"
                                            disabled={!replyContent.trim()}
                                        >
                                            답글 작성
                                        </button>
                                        <button
                                            onClick={handleCancelReply}
                                            className="comment-reply-cancel-btn"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 대댓글 목록 */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="comment-replies">
                                    {comment.replies.map((reply) => (
                                        <div
                                            key={reply.id}
                                            className="comment-reply-item"
                                        >
                                            <div className="comment-reply-header">
                                                <span className="comment-reply-author">
                                                    {reply.nickName || "익명"}
                                                </span>
                                                <span className="comment-reply-date">
                                                    {reply.createdAt &&
                                                        formatDate(
                                                            reply.createdAt,
                                                        )}
                                                </span>
                                            </div>
                                            <div className="comment-reply-content">
                                                {reply.content}
                                            </div>
                                            {/* 대댓글 액션 버튼 */}
                                            {canModifyComment(reply) && (
                                                <div className="comment-reply-actions-small">
                                                    <button
                                                        onClick={() =>
                                                            handleStartEdit(
                                                                reply,
                                                            )
                                                        }
                                                        className="comment-edit-btn-small"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteComment(
                                                                reply.id!,
                                                            )
                                                        }
                                                        className="comment-delete-btn-small"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
