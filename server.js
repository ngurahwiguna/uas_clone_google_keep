const express = require('express');
const cors = require('cors');
const path = require('path');

const noteRoutes = require('./src/routes/noteRoutes'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/api/notes', noteRoutes);

app.listen(PORT, () => {
    console.log(`Server berjalan lancar di http://localhost:${PORT}`);
});