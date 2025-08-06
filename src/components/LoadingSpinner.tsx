interface LoadingSpinnerProps {
    size?: "small" | "medium" | "large";
    color?: "primary" | "secondary" | "custom";
    customColor?: string;
}

const LoadingSpinner = ({
    size = "medium",
    color = "primary",
    customColor,
}: LoadingSpinnerProps) => {
    const sizeClass = `spinner-${size}`;
    const colorClass = `spinner-${color}`;

    const style = customColor ? { borderTopColor: customColor } : {};

    return (
        <div
            className={`loading-spinner ${sizeClass} ${colorClass}`}
            style={style}
        />
    );
};

export default LoadingSpinner;
