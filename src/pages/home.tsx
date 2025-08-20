import Contents from "../components/Contents";
import Intro from "../components/Intro";

export default function Home() {
    return (
        <div className="home-container">
            <Intro />
            <Contents />
        </div>
    );
}
