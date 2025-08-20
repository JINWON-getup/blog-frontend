import { useEffect, useState } from "react";
import { getPosts, type Post } from "../services/api";

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getPosts();
                setPosts(data);
            } catch (err) {
                setError("게시글을 불러오는데 실패했습니다.");
                console.error("게시글 로딩 실패:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;
    if (posts.length === 0) return <div>게시글이 없습니다.</div>;

    return (
        <ul>
            {posts.map((post) => (
                <li key={post.id}>
                    <strong>{post.title}</strong> - {post.nickName}
                </li>
            ))}
        </ul>
    );
};

export default PostList;
