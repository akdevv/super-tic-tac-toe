import admin from "../config/firebaseAdmin.js";

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

export { login };
