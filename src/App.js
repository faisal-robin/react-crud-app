import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AddressBookListComponent from './components/AddressBookList';
import LoginForm from './components/Auth/LoginForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        setLoggedIn(false);
    };

    // useEffect(() => {
    // }, [isLoggedIn]);

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                    <Route
                        path="/home"
                        element={isLoggedIn ? <AddressBookListComponent /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/"
                        element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />}
                    />
                </Routes>
            </Router>
            <ToastContainer />
        </div>
    );
};

export default App;
