import profile from "../../assets/images/profile.png";

export default function Intro() {
    return (
        <section className="w-[1160px] mx-auto pt-[80px] pb-[40px]">
            <div className="flex flex-col items-center">
                <img
                    src={profile}
                    alt="profile"
                    className="w-[150px] h-[150px] rounded-[3px] mb-4"
                />
                <h1 className="text-2xl font-bold">JINmono</h1>
                <p className="text-center mt-2 leading-relaxed">
                    일본말하는 국문과 프로그래머의
                    <br />
                    눈물겨운 일본취업 여행기
                </p>
            </div>
        </section>
    );
}
