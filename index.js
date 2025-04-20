const { Client, Databases } = require("node-appwrite");

module.exports = async ({ req, res, log, error }) => {
  try {
    const payload = req.body;

    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid or missing request body");
    }

    const userId = payload.$id;
    const email = payload.email;

    if (!userId || !email) {
      throw new Error("User ID and email are required");
    }

    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      "unique()",
      {
        userId,
        email,
        name: "",
      },
      [
        `read("user:${userId}")`,
        `write("user:${userId}")`,
        `update("user:${userId}")`,
        `delete("user:${userId}")`,
      ]
    );

    log("✅ User profile created for: " + userId);
    return res.json({ success: true });
  } catch (err) {
    error("❌ Error creating user profile: " + err.message);
    return res.json({ success: false, message: err.message });
  }
};
