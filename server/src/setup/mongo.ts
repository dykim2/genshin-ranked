import mongoose from "mongoose";

export async function setupMongo() {
	try {
		// TODO: Set a cooldown for connection.
		await mongoose.connect(process.env.MONGO_URI || "", {
			dbName: "dev",
		});

		console.log("MongoDB Connected.");
	} catch (err) {
		console.log(`MongoDB Connection Failed: ${err}`);
	}
}
