import type { FormEvent, ChangeEvent } from "react";

interface CommentFormProps {
    onSubmit: (e: FormEvent) => void;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    maxLength: number;
    rows: number;
}

const CommentForm = ({
    onSubmit,
    value,
    onChange,
    maxLength,
    rows,
}: CommentFormProps) => {
    return (
        <form onSubmit={onSubmit} className="comment-form">
            <textarea
                value={value}
                onChange={onChange}
                placeholder="댓글을 작성하세요..."
                className="comment-input"
                rows={rows}
                maxLength={maxLength}
            />
            <div className="comment-form-footer">
                <span className="char-counter">
                    {value.length}/{maxLength}
                </span>
                <button
                    type="submit"
                    className="comment-submit-btn"
                    disabled={!value.trim()}
                >
                    댓글 작성
                </button>
            </div>
        </form>
    );
};

export default CommentForm;
