import type { ChangeEvent } from "react";

// 대댓글 작성 폼
interface ReplyFormProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    onCancel: () => void;
    maxLength: number;
    rows: number;
}

const ReplyForm = ({
    value,
    onChange,
    onSubmit,
    onCancel,
    maxLength,
    rows,
}: ReplyFormProps) => {
    return (
        <div className="comment-reply-form">
            <textarea
                value={value}
                onChange={onChange}
                placeholder="대댓글을 작성하세요..."
                className="comment-reply-input"
                rows={rows}
                maxLength={maxLength}
            />
            <div className="comment-reply-actions">
                <span className="char-counter">
                    {value.length}/{maxLength}
                </span>
                <button
                    onClick={onSubmit}
                    className="comment-reply-submit-btn"
                    disabled={!value.trim()}
                >
                    답글 작성
                </button>
                <button onClick={onCancel} className="comment-reply-cancel-btn">
                    취소
                </button>
            </div>
        </div>
    );
};

export default ReplyForm;
