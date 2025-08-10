// src/services/api.ts
export interface Post {
    id?: number;
    title: string;
    content: string;
    author: string;
    boardType: string;
    category: string;
    tags: string; // 배열에서 문자열로 변경!
    createdAt?: string;
    updatedAt?: string;
}

const API_URL = "http://localhost:8080/api/posts";

export const getPosts = async (): Promise<Post[]> => {
    const res = await fetch(API_URL);
    return res.json();
};

export const createPost = async (
    post: Omit<Post, "id" | "createdAt" | "updatedAt">,
): Promise<Post> => {
    console.log("API 요청 데이터:", post);

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post),
        });

        console.log("API 응답 상태:", res.status, res.statusText);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("API 에러 응답:", errorText);
            throw new Error(
                `HTTP ${res.status}: ${res.statusText} - ${errorText}`,
            );
        }

        const result = await res.json();
        console.log("API 응답 데이터:", result);
        return result;
    } catch (error) {
        console.error("API 요청 실패:", error);
        throw error;
    }
};
