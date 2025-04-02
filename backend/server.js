const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

// CORS middleware
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.send("API is running..");
});

// User routes
app.use('/api/users', userRoutes);

// Notes routes
app.use('/api/notes', noteRoutes);

// Upload file route (properly organized)
app.use('/api/upload', uploadRoutes);// This will make the uploadRoutes accessible at /api/uploadfile




// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
// changed port for vite since ports for server are 5000 and 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
