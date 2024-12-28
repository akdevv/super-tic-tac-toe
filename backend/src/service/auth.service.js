import prisma from "../config/prisma.js";

export const createEmailUser = async (userData) => {
	try {
		
	} catch (error) {
		throw new Error(`Error creating email user: ${error.message}`);
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
