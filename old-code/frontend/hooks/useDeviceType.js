import { useState, useEffect } from "react";

const useDeviceType = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkDevice = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkDevice(); // Initial check
		window.addEventListener("resize", checkDevice); // Update on resize

		return () => window.removeEventListener("resize", checkDevice);
	}, []);

	return { isMobile, isDesktop: !isMobile };
};

export default useDeviceType;
