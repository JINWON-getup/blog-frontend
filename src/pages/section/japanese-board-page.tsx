import Board from "../../components/board";

const japaneseBoardData = [
    {
        id: 1,
        title: "JLPT N1 공부법",
        category: "시험",
        tags: ["JLPT", "한자"],
    },
    {
        id: 2,
        title: "일본 여행 회화",
        category: "회화",
        tags: ["여행", "생활"],
    },
];
const japaneseCategories = ["전체", "시험", "회화"];

export default function JapaneseBoardPage() {
    return (
        <Board boardData={japaneseBoardData} categories={japaneseCategories} />
    );
}
