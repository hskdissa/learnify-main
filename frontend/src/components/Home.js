import React from 'react';
import { Link } from 'react-router-dom';
import img1 from '../assets/img1.jpeg';
import './Home.css';

function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E3F2FD' }}>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <div className="container-fluid">
          <Link className="navbar-brand text-primary fw-bold" to="/">E-Learnify</Link>

          {/* Toggle Button for Mobile */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/resources">Resources</Link>
              </li>
            </ul>

            {/* Register & Login Buttons */}
            <div className="ms-3">
              <Link to="/register" className="btn btn-primary me-2">Register</Link>
              <Link to="/login" className="btn btn-outline-primary">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container text-center d-flex flex-column align-items-center justify-content-center" style={{ height: '85vh' }}>
        <h1 className="text-primary fw-bold fade-in">Convert Your Lectures Into Smart Notes!</h1>
        <p className="text-secondary w-50 fade-in">
          Upload your lecture PDFs, get AI-generated summarized notes, and create quizzes to enhance your learning. 
          Start your journey today and make studying smarter and easier!
        </p>

        {/* Image with Fade-in Effect */}
        <img src={img1} alt="E-learning" className="hero-image fade-in" />

        <Link to="/register" className="btn btn-lg btn-primary fade-in">Get Started</Link>
      </div>
    </div>
  );
}

export default Home;
