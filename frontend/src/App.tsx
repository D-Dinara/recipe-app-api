import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { Register } from './components/Register';
import { Login } from './components/Login';
import RecipesList from './components/RecipesList';
import RecipePage from './components/Recipe';

const Home: React.FC = () => {
    const { user, logout } = useAuth();
    console.log('user', user);

    return (
        <div>
            {user ? (
                <div>
                    <p>Welcome, {user.name}!</p>
                    <button onClick={logout}>Logout</button>
                    <RecipesList />
                </div>
            ) : (
                <div>
                    <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                </div>
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/recipes/:recipeId" element={<RecipePage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
