import Board from "../../components/board"; // 1. 재사용 가능한 Board 컴포넌트를 불러옵니다.

// 2. IT 게시판에만 해당하는 데이터를 정의합니다. (나중에는 API로 받아오게 됩니다.)
const itBoardData = [
    {
        id: 1,
        title: "React로 블로그 만들기",
        category: "React",
        tags: ["React", "JS"],
    },
    {
        id: 2,
        title: "SpringBoot 게시판 구축",
        category: "SpringBoot",
        tags: ["Spring", "Java"],
    },
    {
        id: 3,
        title: "Tailwind로 스타일링",
        category: "Tailwind",
        tags: ["Tailwind", "CSS"],
    },
];
const itCategories = ["전체", "React", "SpringBoot", "Tailwind"];

export default function ItBoardPage() {
    // 3. Board 컴포넌트에 IT 게시판 데이터를 props로 전달하여 렌더링합니다.
    return <Board boardData={itBoardData} categories={itCategories} />;
}
