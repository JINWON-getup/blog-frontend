import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useAdmin } from "../../contexts/AdminContext";
import type { Comment } from "../../services/api";
import axios from "axios";
import "../../css/commentSection.css";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
    postId: number;
}

// 상수 정의
const COMMENT_MAX_LENGTH = 300;
const COMMENT_ROWS = 3;
const REPLY_ROWS = 2;
const API_BASE_URL = "http://localhost:8080/api";

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const { userInfo } = useUser();
    const { isLoggedIn, adminInfo } = useAdmin();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null,
    );
    const [editContent, setEditContent] = useState("");

    // 에러 및 로딩 상태 관리
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 대댓글 관련 상태
    const [replyingToCommentId, setReplyingToCommentId] = useState<
        number | null
    >(null);
    const [replyContent, setReplyContent] = useState("");

    // 에러 처리 유틸리티 함수
    const handleError = (error: unknown, defaultMessage: string) => {
        console.error(error);
        let errorMessage = defaultMessage;

        // Axios 에러 타입 가드
        if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status === 401) {
                errorMessage = "로그인이 필요합니다.";
            } else if (axiosError.response?.status === 403) {
                errorMessage = "권한이 없습니다.";
            } else if (axiosError.response?.status === 404) {
                errorMessage = "요청한 데이터를 찾을 수 없습니다.";
            } else if (
                axiosError.response?.status &&
                axiosError.response.status >= 500
            ) {
                errorMessage =
                    "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            }
        }

        // 네트워크 에러 타입 가드
        if (error && typeof error === "object" && "code" in error) {
            const networkError = error as { code?: string };
            if (networkError.code === "ERR_NETWORK") {
                errorMessage = "네트워크 연결을 확인해주세요.";
            }
        }

        setError(errorMessage);
        setTimeout(() => setError(null), 5000); // 5초 후 에러 메시지 제거
    };

    // userId 설정 함수 (중복 제거)
    const getUserId = (): number => {
        if (isLoggedIn && adminInfo) {
            return adminInfo.id;
        }
        return userInfo?.pid || 0;
    };

    // 댓글 목록 가져오기
    const fetchComments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/comments/post/${postId}`,
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
            handleError(error, "댓글을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
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
                `${API_BASE_URL}/comments`,
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
            handleError(error, "댓글 작성에 실패했습니다.");
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
            await axios.put(`${API_BASE_URL}/comments/${commentId}`, {
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
            handleError(error, "댓글 수정에 실패했습니다.");
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`${API_BASE_URL}/comments/${commentId}`);
            setComments((prev) =>
                prev.filter((comment) => comment.id !== commentId),
            );
        } catch (error) {
            handleError(error, "댓글 삭제에 실패했습니다.");
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
                `${API_BASE_URL}/comments`,
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
            handleError(error, "대댓글 작성에 실패했습니다.");
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

            {/* 에러 메시지 */}
            {error && (
                <div
                    className="error-message"
                    style={{
                        backgroundColor: "#fee",
                        color: "#c33",
                        padding: "10px",
                        borderRadius: "4px",
                        marginBottom: "15px",
                        border: "1px solid #fcc",
                    }}
                >
                    {error}
                </div>
            )}

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
                {isLoading ? (
                    <div
                        className="loading-message"
                        style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#666",
                        }}
                    >
                        댓글을 불러오는 중...
                    </div>
                ) : comments.length === 0 ? (
                    <div className="no-comments">아직 댓글이 없습니다.</div>
                ) : (
                    comments
                        .filter((comment) => !comment.isReply)
                        .map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                editingCommentId={editingCommentId}
                                editContent={editContent}
                                replyingToCommentId={replyingToCommentId}
                                replyContent={replyContent}
                                canModifyComment={canModifyComment}
                                formatDate={formatDate}
                                onStartEdit={handleStartEdit}
                                onSaveEdit={handleSaveEdit}
                                onCancelEdit={handleCancelEdit}
                                onDeleteComment={handleDeleteComment}
                                onStartReply={handleStartReply}
                                onCancelReply={handleCancelReply}
                                onSubmitReply={handleSubmitReply}
                                onEditContentChange={(e) =>
                                    setEditContent(e.target.value)
                                }
                                onReplyContentChange={(e) =>
                                    setReplyContent(e.target.value)
                                }
                                renderReplies={renderReplies}
                                maxLength={COMMENT_MAX_LENGTH}
                                rows={COMMENT_ROWS}
                                replyRows={REPLY_ROWS}
                            />
                        ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
