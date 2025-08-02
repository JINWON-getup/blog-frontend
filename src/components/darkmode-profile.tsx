import { useEffect, useState } from "react";

const ProfileImage = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        setIsDark(
            savedTheme === "dark" ||
                (!savedTheme &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches),
        );

        // 테마 변경 시 이벤트 감지
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <img
            src={
                isDark
                    ? "/images/profile-morning.png"
                    : "/images/profile-evening.png"
            }
            alt="profile"
            className="profile-img"
        />
    );
};

export default ProfileImage;
