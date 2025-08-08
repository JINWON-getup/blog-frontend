import Board from "../../components/Board";

export default function JapaneseBoardPage() {
    return <Board categories={["전체", "JLPT", "문법", "회화", "기타"]} boardType="JAPANESE" />;
}
