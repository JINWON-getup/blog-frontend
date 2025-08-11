import Contents from "../components/Contents";
import Intro from "../components/Intro";

export default function Home() {
    return (
        <div className="home-container">
            <Intro />
            <Contents />
            {/* 나중에 다른 섹션도 여기에 추가하면 됨 */}
        </div>
    );
}
