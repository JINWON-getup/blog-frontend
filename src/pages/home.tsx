import { useEffect } from "react";
import Contents from "../components/Contents";
import Intro from "../components/Intro";

export default function Home() {
    useEffect(() => {
        console.log("Home 컴포넌트 마운트됨");
    }, []);

    return (
        <div className="home-container">
            <Intro />
            <Contents />
            {/* 나중에 다른 섹션도 여기에 추가하면 됨 */}
        </div>
    );
}
