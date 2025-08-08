import Board from "../../components/Board";

export default function DailyBoardPage() {
    return (
        <Board
            categories={[
                "전체",
                "일상",
                "게임",
                "영화",
                "드라마",
                "애니메이션",
                "음악",
                "기타",
            ]}
            boardType="DAILY"
        />
    );
}
