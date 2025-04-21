const { Client, Databases } = require("node-appwrite");

module.exports = async function ({ req, res, log, error }) {
  try {
    const payload = req.payload ?? req.body;

    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid or missing request body");
    }

    const userId = payload.$id || payload.userId;
    const email = payload.email;
    const name = payload.name;
    const role = payload.role || "student";

    if (!userId || !email || !name) {
      throw new Error("User ID, name, and email are required.");
    }

    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    const result = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      "unique()",
      {
        userId,
        email,
        name,
        role,
      },
      [
        `read("user:${userId}")`,
        `write("user:${userId}")`,
        `update("user:${userId}")`,
        `delete("user:${userId}")`,
      ]
    );

    log(`✅ Document created for ${name} (${role})`);
    res.json({ success: true, data: result });
  } catch (err) {
    error("❌ Error creating user profile: " + err.message);
    res.json({ success: false, message: err.message });
  }
};
