const validateUsername = (username) => {
	if (!username) {
		return "username required";
	}
	if (username.length < 6) {
		return "min 6 characters";
	}
	if (username.length > 20) {
		return "max 20 characters";
	}

	const usernameRegex = /^[a-zA-Z0-9_]+$/;
	if (!usernameRegex.test(username)) {
		return "letters, numbers & underscore only";
	}

	return null;
};

const validateEmail = (email) => {
	if (!email) {
		return "email required";
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return "invalid email";
	}

	const commonEmailProviders = [
		"gmail.com",
		"yahoo.com",
		"hotmail.com",
		"outlook.com",
		"aol.com",
		"msn.com",
		"live.com",
		"protonmail.com",
		"icloud.com",
	];
	if (commonEmailProviders.includes(email.split("@")[1])) {
		return "unknown email provider";
	}

	return null;
};

const validatePassword = (password) => {
	if (!password) {
		return "password required";
	}

	if (password.length < 8) {
		return "min 8 characters";
	}

	// password strength check
	const hasUppercase = /[A-Z]/.test(password);
	const hasLowercase = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecialChar = /[!@#$%^&*]/.test(password);

	const requirements = [];
	if (!hasUppercase) requirements.push("uppercase letter");
	if (!hasLowercase) requirements.push("lowercase letter");
	if (!hasNumber) requirements.push("number");
	if (!hasSpecialChar) requirements.push("special character");

	if (requirements.length > 0) {
		return `password must have atleast one ${requirements.join(", ")}`;
	}

	return null;
};

const validatePasswordMatch = (password, confirmPassword) => {
	if (!confirmPassword) {
		return "confirm your password";
	}
	if (password !== confirmPassword) {
		return "passwords do not match";
	}
	return null;
};

const firebaseErrors = (errorCode) => {
	const errorMessages = {
		"auth/email-already-in-use": "email already in use",
		"auth/weak-password": "weak password",
		"auth/invalid-email": "invalid email",
		"auth/operation-not-allowed": "email/password accounts are not enabled",
		"auth/network-request-failed": "network error",
	};

	return errorMessages[errorCode] || "unknown error";
};

export {
	validateUsername,
	validateEmail,
	validatePassword,
	validatePasswordMatch,
	firebaseErrors,
};
