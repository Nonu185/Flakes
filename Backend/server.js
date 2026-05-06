require('dotenv').config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

connectDB();
app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on http://0.0.0.0:3000");
});
