import React, { useState } from "react";

interface PostEditorProps {
    onSubmit: (postData: PostData) => void;
    isLoading?: boolean;
}

interface PostData {
    title: string;
    content: string;
    category: string;
    tags: string[];
}

const PostEditor: React.FC<PostEditorProps> = ({
    onSubmit,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<PostData>({
        title: "",
        content: "",
        category: "",
        tags: [],
    });

    const [tagInput, setTagInput] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()],
                }));
                setTagInput("");
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title.trim() && formData.content.trim()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="max-w-4xl p-6 mx-auto">
            <div className="p-6 border border-gray-200 rounded-lg shadow-lg dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 제목 입력 */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            제목 *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="게시글 제목을 입력하세요"
                            required
                        />
                    </div>

                    {/* 카테고리 선택 */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            카테고리
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">카테고리를 선택하세요</option>
                            <option value="IT">IT</option>
                            <option value="일본어">일본어</option>
                            <option value="문화">문화</option>
                            <option value="일상">일상</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>

                    {/* 태그 입력 */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            태그
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleTagInputKeyPress}
                            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="태그를 입력하고 Enter를 누르세요"
                        />
                    </div>

                    {/* 내용 입력 */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            내용 *
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows={15}
                            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="게시글 내용을 입력하세요..."
                            required
                        />
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-6 py-2 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
                        >
                            {showPreview ? "편집 모드" : "미리보기"}
                        </button>
                        <button
                            type="submit"
                            disabled={
                                isLoading ||
                                !formData.title.trim() ||
                                !formData.content.trim()
                            }
                            className="flex items-center gap-2 px-6 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "저장 중..." : "게시글 저장"}
                        </button>
                    </div>
                </form>

                {/* 미리보기 */}
                {showPreview && (
                    <div className="p-6 mt-8 border border-gray-200 rounded-lg dark:border-gray-700">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                            미리보기
                        </h3>
                        <div className="prose dark:prose-invert max-w-none">
                            <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
                                {formData.title || "제목을 입력하세요"}
                            </h1>
                            {formData.category && (
                                <span className="inline-block px-3 py-1 mb-4 text-sm text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                    {formData.category}
                                </span>
                            )}
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="text-gray-800 whitespace-pre-wrap dark:text-white">
                                {formData.content || "내용을 입력하세요"}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostEditor;
