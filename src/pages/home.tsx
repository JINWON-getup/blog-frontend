import Contents from "./section/Contents";
import Intro from "./section/Intro";

export default function Home() {
    return (
        <>
                <Intro />
                <Contents />
                {/* 나중에 다른 섹션도 여기에 추가하면 됨 */}
        </>
    );
}
