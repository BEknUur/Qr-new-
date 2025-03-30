interface FormButtonProps {
    children: React.ReactNode;
    type?: "button" | "submit";
    onClick?: () => void;
    isLoading?: boolean;
    variant?: "primary" | "secondary";
}

const FormButton: React.FC<FormButtonProps> = ({
    children,
    type = "button",
    onClick,
    isLoading = false,
    variant = "primary"
}) => {
    const baseStyle = "flex-1 py-3 font-bold rounded-lg transition-transform transform hover:scale-105";
    const primaryStyle = "bg-green-600 hover:bg-green-700 text-white";
    const secondaryStyle = "bg-gray-600 hover:bg-gray-700 text-white";

    const buttonStyle = `${baseStyle} ${variant === "primary" ? primaryStyle : secondaryStyle}`;

    return (
        <button
            type={type}
            onClick={onClick}
            className={buttonStyle}
            disabled={isLoading}
        >
            {isLoading ? "Loading..." : children}
        </button>
    );
};

export default FormButton;
