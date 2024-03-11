import { SettingsBtn, InfoBtn } from "./Button";

function Footer() {
	return (
		<footer className="flex justify-between mt-auto text-center text-sm font-firaMono">
			<SettingsBtn />
			<a
				className="mt-auto"
				href="https://github.com/akdevv"
				target="_blank"
			>
				Made by @akdevv
			</a>
			<InfoBtn />
		</footer>
	);
}

export default Footer;
