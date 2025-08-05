import { useState, useEffect } from "react";
import Board from "../../components/Board";
import axios from "../../api/axiosConfig";
import type { Post } from "../../data/_data";
import { japaneseCategories } from "../../data/_data";

// API 응답을 위한 타입 (tags가 문자열)
interface PostFromApi {
    id: number;
    title: string;
    boardType: string;
    category: string;
    content: string;
    tags: string;
}

export default function JapaneseBoardPage() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // 👇 [수정] category=it 대신 boardType=it으로 요청합니다.
                const response = await axios.get<PostFromApi[]>(
                    `/api/posts?boardType=japanese`,
                );

                const formattedPosts: Post[] = response.data.map((post) => ({
                    ...post,
                    tags: post.tags
                        ? post.tags.split(",").map((tag: string) => tag.trim())
                        : [],
                }));

                setPosts(formattedPosts);
            } catch (error) {
                console.error(
                    "일본어 게시글을 불러오는 데 실패했습니다.",
                    error,
                );
            }
        };

        fetchPosts();
    }, []); // 이 페이지가 처음 로드될 때 한 번만 실행됩니다.

    return (
        <Board
            boardData={posts}
            categories={japaneseCategories}
            boardType="japanese"
        />
    );
}
