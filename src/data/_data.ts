// 게시글(Post) 데이터의 타입을 정의합니다.
export interface Post {
    id: number;
    title: string;
    category: string;
    tags: string[];
}

// IT 게시판 데이터
export const itBoardData: Post[] = [
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
export const itCategories = ["전체", "React", "SpringBoot", "Tailwind"];

// Japanese 게시판 데이터
export const japaneseBoardData: Post[] = [
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
export const japaneseCategories = ["전체", "시험", "회화"];

// Culture 게시판 데이터
export const cultureBoardData: Post[] = [
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
        tags: ["J-Pop"],
    },
    {
        id: 3,
        title: "일본의 식문화",
        category: "문화",
        tags: ["문화", "튀김"],
    },
];
export const cultureCategories = ["전체", "영화", "음악", "문화"];
