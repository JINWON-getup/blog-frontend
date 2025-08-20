import Contents from "../components/layout/Contents";
import Intro from "../components/layout/Intro";

export default function Home() {
    return (
        <div className="home-container">
            <Intro />
            <Contents />
        </div>
    );
}
