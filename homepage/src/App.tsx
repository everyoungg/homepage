import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import SignUp from './pages/SignUp';
import UserInfo from './pages/UserInfo';
import Home from './pages/Home';
import WorkoutCategories from './pages/WorkoutCategories';
import WorkoutExercises from './pages/WorkoutExercises';
import WorkoutSession from './pages/WorkoutSession';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user-info" element={<UserInfo />} />
          <Route path="/home" element={<Home />} />
          <Route path="/workout-categories" element={<WorkoutCategories />} />
          <Route path="/workout-exercises/:categoryId" element={<WorkoutExercises />} />
          <Route path="/workout-session/:categoryId/:exerciseId" element={<WorkoutSession />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
