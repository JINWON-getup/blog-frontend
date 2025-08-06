import Board from "../../components/Board";
import { japaneseBoardData, japaneseCategories } from "../../data/_data";

export default function JapaneseBoardPage() {
    return (
        <Board boardData={japaneseBoardData} categories={japaneseCategories} />
    );
}
