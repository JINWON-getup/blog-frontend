import Board from "./Board";
import { useParams } from "react-router-dom";

export default function BoardPage() {
    const { boardType } = useParams<{ boardType: string }>();

    // 유효한 boardType (전부 소문자)
    const validBoardTypes = ["it", "japanese", "daily"];

    if (!boardType || !validBoardTypes.includes(boardType)) {
        return <div>잘못된 게시판입니다.</div>;
    }

    return <Board boardType={boardType} />;
}
