import Board from "../../components/Board";
import { itBoardData, itCategories } from "../../data/_data";

export default function ItBoardPage() {
    return <Board boardData={itBoardData} categories={itCategories} />;
}
