import admin from "../config/firebaseAdmin.js";
import { createGoogleUser } from "../service/auth.service.js";

const login = async (req, res) => {
	const { token } = req.body;

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		console.log("decodedToken = ", decodedToken);

		return res.status(200).json({ message: "Login successful" });
	} catch (error) {
		console.error("Login error: ", error);
		return res.status(500).json({ message: "Login failed" });
	}
};

// GOOGLE ROUTES
const googleLoginOrRegister = async (req, res) => {
	console.log("Got the request from frontend...");
	const { token } = req.body;

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		console.log("decodedToken = ", decodedToken);

		const user = await createGoogleUser(decodedToken);

		return res.status(200).json({
			status: 200,
			message: "User logged in successfully!",
		});
	} catch (error) {
		console.error("Error verifying token: ", error.message);
		return res.status(401).json({
			status: 401,
			message: "Unauthorized",
		});
	}
};

export { login, googleLoginOrRegister };
