// Define JWT payload interface

const auth = async () => {
	try {
		// Check if the token is blacklisted
		// next();
	} catch (error) {
		console.error(error);
		//
		// return res.status(StausCodes.NOT_FOUND).json({ error: "Authentication invalid" });
	}
};

export default auth;
