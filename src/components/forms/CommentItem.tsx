import type { Comment } from "../../services/api";
import CommentEditForm from "./CommentEditForm";
import ReplyForm from "./ReplyForm";

interface CommentItemProps {
    comment: Comment;
    editingCommentId: number | null;
    editContent: string;
    replyingToCommentId: number | null;
    replyContent: string;
    canModifyComment: (comment: Comment) => boolean;
    formatDate: (dateString: string) => string;
    onStartEdit: (comment: Comment) => void;
    onSaveEdit: (commentId: number) => void;
    onCancelEdit: () => void;
    onDeleteComment: (commentId: number) => void;
    onStartReply: (commentId: number) => void;
    onCancelReply: () => void;
    onSubmitReply: (parentCommentId: number) => void;
    onEditContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onReplyContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    renderReplies: (commentId: number) => React.ReactNode;
    maxLength: number;
    rows: number;
    replyRows: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    editingCommentId,
    editContent,
    replyingToCommentId,
    replyContent,
    canModifyComment,
    formatDate,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDeleteComment,
    onStartReply,
    onCancelReply,
    onSubmitReply,
    onEditContentChange,
    onReplyContentChange,
    renderReplies,
    maxLength,
    rows,
    replyRows,
}) => {
    return (
        <div className="comment-item">
            <div className="comment-header">
                <span className="comment-author">
                    {comment.nickName || `사용자${comment.userId}`}
                </span>
                <span className="comment-date">
                    {comment.createdAt && formatDate(comment.createdAt)}
                </span>
            </div>

            {editingCommentId === comment.id ? (
                <CommentEditForm
                    value={editContent}
                    onChange={onEditContentChange}
                    onSave={() => onSaveEdit(comment.id!)}
                    onCancel={onCancelEdit}
                    maxLength={maxLength}
                    rows={rows}
                />
            ) : (
                <div className="comment-content">{comment.content}</div>
            )}

            {/* 댓글 액션 버튼 */}
            <div className="comment-actions">
                {/* 대댓글 버튼 */}
                <button
                    onClick={() => onStartReply(comment.id!)}
                    className="comment-reply-btn"
                >
                    답글
                </button>

                {/* 수정/삭제 버튼 (권한이 있는 경우만) */}
                {canModifyComment(comment) && (
                    <>
                        <button
                            onClick={() => onStartEdit(comment)}
                            className="comment-edit-btn"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => onDeleteComment(comment.id!)}
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
                    onChange={onReplyContentChange}
                    onSubmit={() => onSubmitReply(comment.id!)}
                    onCancel={onCancelReply}
                    maxLength={maxLength}
                    rows={replyRows}
                />
            )}

            {/* 대댓글 목록 */}
            {comment.id && renderReplies(comment.id)}
        </div>
    );
};

export default CommentItem;
