const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const openaiRoutes = require("./routes/openaiRoutes");
const studyNoteRoutes = require("./routes/studyNoteRoutes");



const app = express();
dotenv.config();
connectDB();
app.use(express.json());

// CORS middleware
app.use(cors());


app.use(cors({
  origin: 'http://localhost:3000',  // Only allow requests from localhost:3000 (frontend)
  credentials: true                 // Allow cookies or credentials if required
}));

// Root route
app.get('/', (req, res) => {
  res.send("API is running..");
});

// User routes
app.use('/api/users', userRoutes);

// Notes routes
app.use('/api/notes', noteRoutes);

// Upload file route
app.use('/api/upload', uploadRoutes);

// Study notes generation route
app.use("/api/openai", openaiRoutes);

app.use("/api/studynotes", studyNoteRoutes);





app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});



// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
// changed port for vite since ports for server are 5000 and 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
