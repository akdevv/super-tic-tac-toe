import {
	createEmailUser,
	loginEmailUser,
	createGoogleUser,
} from "../service/auth.service.js";
import admin from "../config/firebaseAdmin.js";

// LOGIN ROUTE
const login = async (req, res) => {
	const { token } = req.body;

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		const user = await loginEmailUser(decodedToken);

		return res.status(200).json({
			user,
			message: "Login successful!",
		});
	} catch (error) {
		console.error("Login error: ", error.message);
		return res.status(500).json({ message: "Login failed!" });
	}
};

// REGISTER ROUTE
const register = async (req, res) => {
	const { token, username } = req.body;

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);

		const user = await createEmailUser(username, decodedToken);

		return res.status(200).json({
			user,
			message: "Registration successful!",
		});
	} catch (error) {
		console.error("Registration error: ", error.message);
		return res.status(500).json({ message: "Registration failed!" });
	}
};

// GOOGLE ROUTE
const googleLoginOrRegister = async (req, res) => {
	const { token } = req.body;

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		const user = await createGoogleUser(decodedToken);

		return res.status(200).json({
			user,
			message: "User logged in successfully!",
		});
	} catch (error) {
		console.error("Google authentication error: ", error.message);
		return res.status(401).json({ message: "Unauthorized!" });
	}
};

export { login, register, googleLoginOrRegister };
