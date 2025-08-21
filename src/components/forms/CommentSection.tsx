import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useAdmin } from "../../contexts/AdminContext";
import type { Comment } from "../../services/api";
import axios from "axios";
import "../../css/commentSection.css";
import CommentForm from "./CommentForm";
import CommentEditForm from "./CommentEditForm";
import ReplyForm from "./ReplyForm";

interface CommentSectionProps {
    postId: number;
}

// 상수 정의
const COMMENT_MAX_LENGTH = 300;
const COMMENT_ROWS = 3;
const REPLY_ROWS = 2;

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const { userInfo } = useUser();
    const { isLoggedIn, adminInfo } = useAdmin();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null,
    );
    const [editContent, setEditContent] = useState("");

    // 대댓글 관련 상태
    const [replyingToCommentId, setReplyingToCommentId] = useState<
        number | null
    >(null);
    const [replyContent, setReplyContent] = useState("");

    // userId 설정 함수 (중복 제거)
    const getUserId = (): number => {
        if (isLoggedIn && adminInfo) {
            return adminInfo.id;
        }
        return userInfo?.pid || 0;
    };

    // 댓글 목록 가져오기
    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/comments/post/${postId}`,
            );
            // 댓글 데이터에 닉네임 정보 추가
            const commentsWithNickname = (response.data as Comment[]).map(
                (comment: Comment) => ({
                    ...comment,
                    nickName: comment.nickName || `사용자${comment.userId}`,
                }),
            );
            setComments(commentsWithNickname);
        } catch (error) {
            console.error("댓글을 불러오는 중 오류:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    // 댓글 작성
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const userId = getUserId();
            const commentData = {
                content: newComment.trim(),
                postId: postId,
                userId: userId,
                userType: isLoggedIn && adminInfo ? "ADMIN" : "USER",
                parentCommentId: undefined,
                isReply: false,
            };

            const response = await axios.post(
                `http://localhost:8080/api/comments`,
                commentData,
            );
            // 응답에 닉네임 정보 추가
            const commentWithNickname: Comment = {
                ...(response.data as Comment),
                nickName:
                    isLoggedIn && adminInfo
                        ? adminInfo.adminName
                        : userInfo?.nickName,
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
            await axios.put(`http://localhost:8080/api/comments/${commentId}`, {
                content: editContent.trim(),
            });
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
            await axios.delete(
                `http://localhost:8080/api/comments/${commentId}`,
            );
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
            const userId = getUserId();
            const replyData = {
                content: replyContent.trim(),
                postId: postId,
                userId: userId,
                userType: isLoggedIn && adminInfo ? "ADMIN" : "USER",
                parentCommentId: parentCommentId,
                isReply: true,
            };

            const response = await axios.post(
                `http://localhost:8080/api/comments`,
                replyData,
            );
            const replyWithNickname: Comment = {
                ...(response.data as Comment),
                nickName:
                    isLoggedIn && adminInfo
                        ? adminInfo.adminName
                        : userInfo?.nickName,
            };

            setComments((prev) => [replyWithNickname, ...prev]);
            setReplyingToCommentId(null);
            setReplyContent("");
        } catch (error) {
            console.error("대댓글 작성 중 오류:", error);
            alert("대댓글 작성에 실패했습니다.");
        }
    };

    // 대댓글 목록 렌더링 함수 (복잡한 IIFE 제거)
    const renderReplies = (commentId: number) => {
        const replies = comments.filter(
            (reply) => reply.isReply && reply.parentCommentId === commentId,
        );

        if (replies.length === 0) return null;

        return (
            <div className="comment-replies">
                {replies.map((reply) => (
                    <div key={reply.id} className="comment-reply-item">
                        <div className="comment-reply-header">
                            <span className="comment-reply-author">
                                {reply.nickName || `사용자${reply.userId}`}
                            </span>
                            <span className="comment-reply-date">
                                {reply.createdAt && formatDate(reply.createdAt)}
                            </span>
                        </div>
                        <div className="comment-reply-content">
                            {reply.content}
                        </div>
                        {/* 대댓글 액션 버튼 */}
                        {canModifyComment(reply) && (
                            <div className="comment-reply-actions-small">
                                <button
                                    onClick={() => handleStartEdit(reply)}
                                    className="comment-edit-btn-small"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteComment(reply.id!)
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
        );
    };

    return (
        <div className="comment-section">
            <h3 className="comment-title">댓글 ({comments.length})</h3>

            {/* 댓글 작성 폼 */}
            {(userInfo || isLoggedIn) && (
                <CommentForm
                    onSubmit={handleSubmitComment}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    maxLength={COMMENT_MAX_LENGTH}
                    rows={COMMENT_ROWS}
                />
            )}

            {/* 댓글 목록 */}
            <div className="comment-list">
                {comments.length === 0 ? (
                    <div className="no-comments">아직 댓글이 없습니다.</div>
                ) : (
                    comments
                        .filter((comment) => !comment.isReply)
                        .map((comment) => (
                            <div key={comment.id} className="comment-item">
                                <div className="comment-header">
                                    <span className="comment-author">
                                        {comment.nickName ||
                                            `사용자${comment.userId}`}
                                    </span>
                                    <span className="comment-date">
                                        {comment.createdAt &&
                                            formatDate(comment.createdAt)}
                                    </span>
                                </div>

                                {editingCommentId === comment.id ? (
                                    <CommentEditForm
                                        value={editContent}
                                        onChange={(e) =>
                                            setEditContent(e.target.value)
                                        }
                                        onSave={() =>
                                            handleSaveEdit(comment.id!)
                                        }
                                        onCancel={handleCancelEdit}
                                        maxLength={COMMENT_MAX_LENGTH}
                                        rows={COMMENT_ROWS}
                                    />
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
                                                    handleDeleteComment(
                                                        comment.id!,
                                                    )
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
                                    <ReplyForm
                                        value={replyContent}
                                        onChange={(e) =>
                                            setReplyContent(e.target.value)
                                        }
                                        onSubmit={() =>
                                            handleSubmitReply(comment.id!)
                                        }
                                        onCancel={handleCancelReply}
                                        maxLength={COMMENT_MAX_LENGTH}
                                        rows={REPLY_ROWS}
                                    />
                                )}

                                {/* 대댓글 목록 */}
                                {comment.id && renderReplies(comment.id)}
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
