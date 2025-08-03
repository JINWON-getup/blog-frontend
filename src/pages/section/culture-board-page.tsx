import Board from "../../components/board"; // 1. 재사용 가능한 Board 컴포넌트를 불러옵니다.

// 2. Culture 게시판에만 해당하는 데이터를 정의합니다.
const cultureBoardData = [
    {
        id: 1,
        title: "최근에 본 영화 후기",
        category: "영화",
        tags: ["리뷰", "SF"],
    },
    {
        id: 2,
        title: "여름에 듣기 좋은 플레이리스트",
        category: "음악",
        tags: ["J-Pop", "인디"],
    },
    {
        id: 3,
        title: "가볼 만한 전시회 추천",
        category: "전시",
        tags: ["사진전", "현대미술"],
    },
];

const cultureCategories = ["전체", "영화", "음악", "전시"];

export default function CultureBoardPage() {
    // 3. Board 컴포넌트에 Culture 게시판 데이터를 props로 전달하여 렌더링합니다.
    return (
        <Board boardData={cultureBoardData} categories={cultureCategories} />
    );
}
