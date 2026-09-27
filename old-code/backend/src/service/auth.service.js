import prisma from "../config/prisma.js";

/**
 * Create a new user in the database
 * @param String username - The username of the user
 * @param Object userData - The user data from Firebase
 * @returns {Promise<Object>} The created user
 */
export const createEmailUser = async (username, userData) => {
	try {
		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { uid: userData.uid },
		});

		// Update last login time and return user
		if (existingUser) {
			return await prisma.user.update({
				where: { uid: userData.uid },
				data: { lastLoginAt: new Date() },
			});
		}

		// Create new user
		return await prisma.user.create({
			data: {
				uid: userData.uid,
				username,
				email: userData.email,
				provider: "email",
				email_verified: userData.email_verified,
				lastLoginAt: new Date(),
			},
		});
	} catch (error) {
		throw new Error(`Error creating email user: ${error.message}`);
	}
};

/**
 * Login an existing user
 * @param Object userData - The user data from Firebase
 * @returns {Promise<Object>} The created user
 */
export const loginEmailUser = async (userData) => {
	try {
		const user = await prisma.user.findUnique({
			where: { uid: userData.uid },
		});

		if (user) {
			return await prisma.user.update({
				where: { uid: userData.uid },
				data: { lastLoginAt: new Date() },
			});
		} else {
			throw new Error("User not found");
		}
	} catch (error) {
		throw new Error(`Error logging in email user: ${error.message}`);
	}
};

/**
 * Create a new user in the database
 * @param Object userData - The user data from Firebase
 * @returns {Promise<Object>} The created user
 */
export const createGoogleUser = async (userData) => {
	try {
		const username = userData.email.split("@")[0].toLowerCase();

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { uid: userData.uid },
		});

		// Update last login time and return user
		if (existingUser) {
			return await prisma.user.update({
				where: { uid: userData.uid },
				data: { lastLoginAt: new Date() },
			});
		}

		// Create new user
		return await prisma.user.create({
			data: {
				uid: userData.uid,
				username,
				email: userData.email,
				provider: "google",
				email_verified: userData.email_verified,
				name: userData.name,
				picture: userData.picture,
				lastLoginAt: new Date(),
			},
		});
	} catch (error) {
		throw new Error(`Error creating Google user: ${error.message}`);
	}
};
