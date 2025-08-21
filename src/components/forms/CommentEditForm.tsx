import type { ChangeEvent } from "react";

// 댓글 수정 폼
interface CommentEditFormProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    maxLength: number;
    rows: number;
}

const CommentEditForm = ({
    value,
    onChange,
    onSave,
    onCancel,
    maxLength,
    rows,
}: CommentEditFormProps) => {
    return (
        <div className="comment-edit-form">
            <textarea
                value={value}
                onChange={onChange}
                className="comment-edit-input"
                rows={rows}
                maxLength={maxLength}
            />
            <div className="comment-edit-actions">
                <span className="char-counter">
                    {value.length}/{maxLength}
                </span>
                <button
                    onClick={onSave}
                    className="comment-save-btn"
                    disabled={!value.trim()}
                >
                    저장
                </button>
                <button onClick={onCancel} className="comment-cancel-btn">
                    취소
                </button>
            </div>
        </div>
    );
};

export default CommentEditForm;
