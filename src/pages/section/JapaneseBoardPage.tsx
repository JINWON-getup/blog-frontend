import Board from "../../components/Board";
// 중앙 데이터 파일에서 필요한 데이터를 가져옵니다.
import { japaneseBoardData, japaneseCategories } from "../../data/_data";

export default function JapaneseBoardPage() {
    return (
        <Board boardData={japaneseBoardData} categories={japaneseCategories} />
    );
}
