const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);

  try {
    if (!req.payload) {
      throw new Error("No payload received");
    }

    const data = JSON.parse(req.payload);

    const { userId, email, name, role } = data;

    const databaseId = "68051d5b00243bd43c1b";
    const collectionId = "68051d760023497301e1";

    const document = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()",
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

    res.send(
      JSON.stringify({
        success: true,
        message: "User document created successfully",
        data: document,
      })
    );
  } catch (err) {
    res.send(
      JSON.stringify({
        success: false,
        message: err.message,
      })
    );
  }
};
