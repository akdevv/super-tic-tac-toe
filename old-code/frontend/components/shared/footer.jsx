import Link from "next/link";

export default function Footer() {
	return (
		<footer className="flex w-full justify-center">
			<Link
				href="https://github.com/akdevv"
				target="_blank"
				className="font-fira text-sm hover:underline text-light-700"
			>
				made by @akdevv
			</Link>
		</footer>
	);
}
