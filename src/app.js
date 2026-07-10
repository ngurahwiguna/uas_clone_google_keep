const express = require("express");
const path = require("path");

const app = express();

// Folder public menjadi folder static
app.use(express.static(path.join(__dirname, "../public")));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});