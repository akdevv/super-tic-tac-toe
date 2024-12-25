import { forwardRef } from "react";

const Button = forwardRef(
	(
		{
			children,
			className = "",
			variant = "primary",
			size = "md",
			disabled = false,
			type = "button",
			...props
		},
		ref
	) => {
		const baseStyles =
			"inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

		const variants = {
			primary:
				"bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
			secondary:
				"bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
			outline:
				"border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500",
		};

		const sizes = {
			sm: "h-8 px-3 text-sm",
			md: "h-10 px-4 text-base",
			lg: "h-12 px-6 text-lg",
		};

		return (
			<button
				ref={ref}
				type={type}
				disabled={disabled}
				className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
				{...props}
			>
				{children}
			</button>
		);
	}
);

Button.displayName = "Button";

export default Button;
