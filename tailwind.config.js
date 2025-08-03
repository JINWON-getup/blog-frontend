/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // 다크 모드 방식 설정 (class 방식)
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Tailwind가 적용될 파일들
    theme: {
        extend: {},
    },
    plugins: [],
};
