const app = require("./app");
const { connectToDatabase } = require("./config/database");
const PORT = process.env.PORT || 3000;
async function runServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

runServer();
