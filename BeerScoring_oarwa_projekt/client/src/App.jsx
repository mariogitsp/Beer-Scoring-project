import { useState } from 'react';
import './App.css';
import LoginRegister from './LoginRegister';
import BeerDetail from './BeerDetail';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import HomePage from './HomePage';
import Navigation from './Navigation.jsx';
import UserProfile from './UserProfile.jsx';
import Footer from './Footer.jsx';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <BrowserRouter>
      <div className='app'>
        {user && <Navigation />}
        <Routes>        
          <Route path="/beer/:id" element={user ? <BeerDetail /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
          <Route path='/profile' element={user ? <UserProfile /> : <Navigate to="/login" />} />
        </Routes>

        {user && <Footer />}
      </div>
      
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App;
