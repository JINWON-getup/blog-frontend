import Board from "../../components/Board";
// 중앙 데이터 파일에서 필요한 데이터를 가져옵니다.
import { cultureBoardData, cultureCategories } from "../../data/_data";

export default function CultureBoardPage() {
    return (
        <Board boardData={cultureBoardData} categories={cultureCategories} />
    );
}
