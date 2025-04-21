const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const database = new sdk.Databases(client);

  try {
    const payload = JSON.parse(req.env.APPWRITE_FUNCTION_EVENT_DATA);
    const userId = payload.$id;
    const name = payload.name || "";
    const email = payload.email;

    const role = payload.labels?.includes("student")
      ? "student"
      : payload.labels?.includes("teacher")
      ? "teacher"
      : "user";

    const result = await database.createDocument(
      "68051d5b00243bd43c1b",
      "68051d760023497301e1",
      "unique()",
      {
        userId,
        name,
        email,
        role,
      },
      [
        `read("user:${userId}")`,
        `update("user:${userId}")`,
        `delete("user:${userId}")`,
      ]
    );

    return res.json({
      success: true,
      userId,
      document: result,
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};
