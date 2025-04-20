const { Client, Databases } = require("node-appwrite");

export default async ({ req, res, log, error }) => {
  try {
    const payload = JSON.parse(req.payload);
    const userId = payload.$id;
    const email = payload.email;

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
        createdAt: new Date().toISOString(),
      },
      [
        `user:${userId}`,
      ]
    );

    log("User profile created for: " + userId);
    return res.json({ success: true });
  } catch (err) {
    error("Error creating user profile: " + err.message);
    return res.json({ success: false, message: err.message });
  }
};
