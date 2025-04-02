const express = require('express');
const notes = require('./data/notes');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); 
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

/*// Root route
app.get('/', (req, res) => {
    res.send("API is running..");
});

// Get all notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});
*/

// Use user routes
app.use('/api/users', userRoutes); 

app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
