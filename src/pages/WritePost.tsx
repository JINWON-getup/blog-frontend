import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostEditor from "../components/PostEditor";

interface PostData {
    title: string;
    content: string;
    category: string;
    tags: string[];
}

const WritePost: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSubmit = async (postData: PostData) => {
        setIsLoading(true);
        setMessage(null);

        try {
            // 실제 API 호출을 여기에 구현
            // const response = await fetch('http://localhost:8080/api/posts', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({
            //     ...postData,
            //     author: '작성자', // 실제로는 로그인된 사용자 정보 사용
            //     isPublished: true,
            //     status: 'published'
            //   })
            // });

            // 임시로 성공 메시지 표시
            setTimeout(() => {
                setMessage({
                    type: "success",
                    text: "게시글이 성공적으로 저장되었습니다!",
                });
                setIsLoading(false);

                // 2초 후 홈페이지로 이동
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }, 1500);
        } catch {
            setMessage({
                type: "error",
                text: "게시글 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* 헤더 */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate("/")}
                                className="text-gray-500 transition-colors dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                ✍️ 새 게시글 작성
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* 작성 팁 */}
            <div className="max-w-4xl px-6 pt-4 mx-auto">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        💡 <strong>작성 팁:</strong>
                    </p>
                    <ul className="mt-2 space-y-1">
                        <li>• 제목은 명확하고 간결하게 작성하세요</li>
                        <li>• 카테고리를 선택하면 분류가 용이합니다</li>
                        <li>• 태그는 콤마(,)로 구분하여 입력하세요</li>
                        <li>
                            • 미리보기 버튼으로 작성 중인 내용을 확인할 수
                            있습니다
                        </li>
                    </ul>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="py-4">
                {/* 성공/오류 메시지 */}
                {message && (
                    <div className="max-w-4xl px-6 mx-auto mb-4">
                        <div
                            className={`p-4 rounded-lg ${
                                message.type === "success"
                                    ? "bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200"
                                    : "bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200"
                            }`}
                        >
                            <div className="flex items-center">
                                <svg
                                    className={`w-5 h-5 mr-2 ${
                                        message.type === "success"
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    {message.type === "success" ? (
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    ) : (
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    )}
                                </svg>
                                {message.text}
                            </div>
                        </div>
                    </div>
                )}

                {/* 게시글 편집기 */}
                <PostEditor onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default WritePost;
