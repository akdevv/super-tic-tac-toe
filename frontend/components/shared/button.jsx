export default function Button({
	children,
	variant = "primary",
	size = "md",
	disabled = false,
	...props
}) {
	const baseStyles =
		"border-2 border-black shadow-[6px_6px_0px_0px_#949392] font-medium disabled:cursor-not-allowed active:translate-x-1 active:translate-y-1 active:shadow-none transition-all";

	const variants = {
		primary:
			"bg-light-900 text-light-100 hover:bg-light-900/80 disabled:bg-light-900/80",
		secondary:
			"bg-light-100 text-light-900 hover:bg-light-200 disabled:bg-light-100/80",
		destructive:
			"bg-error-light text-light-100 hover:bg-error-light/80 disabled:bg-error-light/80",
		icon: "rounded-full w-14 h-14 bg-light-900 text-light-100 hover:bg-light-900/80",
	};

	const sizes = {
		sm: "px-4 py-1 text-sm",
		md: "px-8 py-2 text-lg",
		lg: "px-12 py-3 text-xl",
		full: "w-full px-8 py-2",
	};

	return (
		<button
			disabled={disabled}
			className={`${baseStyles} ${variants[variant]} ${
				variant !== "icon" && sizes[size]
			}`}
			{...props}
		>
			{children}
		</button>
	);
}
