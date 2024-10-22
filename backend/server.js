require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;


app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://tobiasbuetschi.github.io'
}));
app.use(express.json());

mongoose.connect(uri)
  .then(() => console.log('Connection to MongoDB is established'))
  .catch(err => {
    console.error('Connecting to MongoDB failed:', err.message);

    console.error('Whole error:', err);
    console.error('Connection-URI (without password):', uri.replace(password, '****'));
  });


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

// Workout Schema
const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now },
  duration: { type: Number, required: true },
  exercises: [{
    exerciseId: { type: String, required: true },
    sets: [{
      reps: { type: Number, required: true },
      weight: { type: Number, required: true },
      dropSet: {
        reps: Number,
        weight: Number
      }
    }]
  }]
});

const Workout = mongoose.model('Workout', WorkoutSchema);

app.get('/', (req, res) => {
  res.send('Welcome to the Fitness App API');
});

// Register
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
    const { usernameOrEmail, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username/email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username/email or password' });
    }
    res.json({ message: 'Login successful', userId: user._id, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
});


// Save Workout
app.post('/api/workouts', async (req, res) => {
  try {
    const workoutData = req.body;
    if (!workoutData.userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }
    const workout = new Workout(workoutData);
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: 'Error saving workout', error: error.message });
  }
});

// Get Workouts
app.get('/api/workouts/:userId', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId });
    res.json(workouts);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching workouts', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Delete Workout
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const workoutId = req.params.id;
    console.log('Received delete request for workout ID:', workoutId);
    if (!workoutId) {
      return res.status(400).json({ message: 'Workout ID is required' });
    }
    const result = await Workout.findByIdAndDelete(workoutId);
    if (result) {
      res.json({ message: 'Workout deleted successfully' });
    } else {
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Error deleting workout', error: error.message });
  }
});