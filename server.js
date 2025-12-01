// server.js
const app = require("./src/app");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ShadowGPT API listening on http://localhost:${PORT}`);
});
