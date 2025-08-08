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
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
    });
    return res.json();
};
