import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';

function App() {
  const [isLoggedIn,setIsLoggedIn] =useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard onLogin={()=>{setIsLoggedIn(true)}} />} />
         <Route path="/users" element={<UserManagement onLogout={()=>{setIsLoggedIn(false)}} isLoggedIn={isLoggedIn}/>} />
        <Route path="/settings" element={<Settings onLogout={()=>{setIsLoggedIn(false)}} isLoggedIn={isLoggedIn} />} /> 
      </Routes>
    </Router>
  );
}

export default App;
