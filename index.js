const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Don't change unless using self-hosted
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // Set this secret in Appwrite Function config

  const databases = new sdk.Databases(client);

  try {
    // ✅ Appwrite functions use `req.payload`, not `req.json()`
    if (!req.payload) {
      throw new Error("No payload received");
    }

    const data = JSON.parse(req.payload);

    // Destructure required fields from payload
    const { userId, email, name, role = "student" } = data;

    // Replace with your actual database and collection IDs
    const databaseId = "68051d5b00243bd43c1b";
    const collectionId = "68051d760023497301e1";

    // Create user document
    const document = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()", // let Appwrite generate a unique doc ID
      {
        userId,
        email,
        name,
        role,
      },
      [
        `read("user:${userId}")`,
        `update("user:${userId}")`,
        `delete("user:${userId}")`,
      ]
    );

    res.json({
      success: true,
      message: "User document created",
      data: document,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};
