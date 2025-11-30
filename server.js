const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const commentRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.text({ limit: '10mb' }));
app.use(express.static('public'));

// Routes
app.use('/api', commentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CommentClean API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`CommentClean server running on port ${PORT}`);
});
