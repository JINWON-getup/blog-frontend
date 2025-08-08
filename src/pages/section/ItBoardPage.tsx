import Board from "../../components/Board";

export default function ItBoardPage() {
    return (
        <Board
            categories={["전체", "Frontend", "Backend", "Database", "기타"]}
            boardType="IT"
        />
    );
}
