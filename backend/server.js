const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;
const password = encodeURIComponent('Tiger187BIT!');
const uri = `mongodb://turborudy:${password}@localhost:27017/fitness_app?authSource=admin`;


app.use(cors());
app.use(express.json());

mongoose.connect(uri)
  .then(() => console.log('Connection to MongoDB is established'))
  .catch(err => {
    console.error('Connecting to MongoDB failed:', err.message);
    // Zusätzliche Informationen für Debugging
    console.error('Whole error:', err);
    console.error('Connection-URI (without password):', uri.replace(password, '****'));
  });

// Fügen Sie einen Ereignislistener für Verbindungsfehler hinzu
mongoose.connection.on('error', err => {
  console.error('MongoDB Connecting Error:', err);
});
// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Training Schema
const TrainingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  exercises: [{ 
    name: String,
    sets: Number,
    reps: Number,
    weight: Number
  }]
});

const Training = mongoose.model('Training', TrainingSchema);

// Registrierung
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
});

// Training speichern
app.post('/api/training', async (req, res) => {
  try {
    const { userId, exercises } = req.body;
    const training = new Training({ userId, exercises });
    await training.save();
    res.status(201).json({ message: 'Training saved successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error saving training', error: error.message });
  }
});

// Trainings abrufen
app.get('/api/training/:userId', async (req, res) => {
  try {
    const trainings = await Training.find({ userId: req.params.userId });
    res.json(trainings);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching trainings', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});