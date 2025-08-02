import Contents from "./section/contents";
import Intro from "./section/intro";

export default function Home() {
    return (
        <>
            {/* <div className="bg-section"> */}
                <Intro />
                <Contents />
                {/* 나중에 다른 섹션도 여기에 추가하면 됨 */}
            {/* </div> */}
        </>
    );
}
