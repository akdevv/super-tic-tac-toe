const validateUsername = (username) => {
	if (!username) {
		return "Username required";
	}
	if (username.length < 6) {
		return "Min 6 characters";
	}
	if (username.length > 20) {
		return "Max 20 characters";
	}

	const usernameRegex = /^[a-zA-Z0-9_]+$/;
	if (!usernameRegex.test(username)) {
		return "Letters, numbers & underscore only";
	}

	return null;
};

const validateEmail = (email) => {
	if (!email) {
		return "Email required";
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return "Invalid email";
	}

	return null;
};

const validatePassword = (password) => {
	if (!password) {
		return "Password required";
	}

	if (password.length < 8) {
		return "Min 8 characters";
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
		return `Password must have atleast one ${requirements.join(", ")}`;
	}

	return null;
};

const validatePasswordMatch = (password, confirmPassword) => {
	if (!confirmPassword) {
		return "Confirm your password";
	}
	if (password !== confirmPassword) {
		return "Passwords do not match";
	}
	return null;
};

const firebaseErrors = (errorCode) => {
	const errorMessages = {
		"auth/email-already-in-use": "Email already in use",
		"auth/weak-password": "Weak password",
		"auth/invalid-email": "Invalid email",
		"auth/operation-not-allowed": "Email/password accounts are not enabled",
		"auth/network-request-failed": "Network error",
	};

	return errorMessages[errorCode] || "Unknown error";
};

export {
	validateUsername,
	validateEmail,
	validatePassword,
	validatePasswordMatch,
	firebaseErrors,
};
