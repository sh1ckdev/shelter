// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { store } from "./stores/store";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AuthForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileLayout from "./components/ProfileLayout";
import RegisterForm from "./components/RegisterForm";
import Alert from "./components/Alert";
import PublicRoute from "./components/PublicRoute";
import NotFoundPage from "./components/NotFound";
import Animals from "./pages/Animals";
import AnimalDetails from "./components/AnimalDetails";
import AdoptedAnimals from "./components/AdoptedAnimals";
import ModeratorRoute from "./components/ModeratorRoute";
import ModeratorLayout from "./components/Moderator/ModeratorLayout";
import VolunteerManagement from "./components/Moderator/VolunteerManagement";
import AnimalManagement from "./components/Moderator/AnimalManagement";
import NewsManagement from "./components/Moderator/NewsManagement";
import ModeratorProfile from "./components/Moderator/ModeratorProfile";
import AdoptionModeration from "./components/Moderator/AdoptionModeration";

function App() {
    useEffect(() => {
        store.checkAuth();
    }, []);

    return (
        <Router>
            <Alert />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/animals" element={<Animals />} />
                <Route path="/animals/:id" element={<AnimalDetails />} />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <AuthForm type="login" />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterForm type="register" />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfileLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Profile />} />
                    <Route path="/profile/adoptions" element={<AdoptedAnimals />} />
                </Route>
                <Route
                    path="/moderator"
                    element={
                        <ModeratorRoute>
                            <ModeratorLayout />
                        </ModeratorRoute>
                    }
                >   
                    <Route index element={<ModeratorProfile />} />
                    <Route path="/moderator/volunteers" element={<VolunteerManagement />} />
                    <Route path="/moderator/manage-animals" element={<AnimalManagement />} />
                    <Route path="/moderator/news" element={<NewsManagement />} />
                    <Route path="/moderator/adoptions" element={<AdoptionModeration />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App;
