import { useEffect, useRef, useState } from "react";

interface ScrollAnimationProps {
    children: React.ReactNode;
    animation?: "fade-up" | "fade-left" | "fade-right" | "scale";
    delay?: number;
    threshold?: number;
}

const ScrollAnimation = ({
    children,
    animation = "fade-up",
    delay = 0,
    threshold = 0.1,
}: ScrollAnimationProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold,
                rootMargin: "0px 0px -50px 0px",
            },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    return (
        <div
            ref={ref}
            className={`scroll-animation ${animation} ${
                isVisible ? "visible" : ""
            }`}
            style={{ animationDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
};

export default ScrollAnimation;
