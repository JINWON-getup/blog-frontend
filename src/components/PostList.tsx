import React, { useEffect, useState } from "react";
import { getPosts, type Post } from "../services/api";

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        getPosts().then(setPosts);
    }, []);

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
