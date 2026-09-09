import "./App.css";
import Header from "./components/Header/Header.jsx";
import Home from "./components/Home/Home.jsx";
import Products from "./components/products/Products.jsx";
import Login from "./components/login/Login.jsx";
import Signup from "./components/signup/Signup.jsx";
import Others from "./components/others/Others.jsx";
import ProductProfile from "./components/products/ProductProfile.jsx";
import Chat from "./components/chat/Chat.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./authContext.jsx";

function AppContent() {
  const { loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/others" element={<Others />} />
        <Route path="/product/:id" element={<ProductProfile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
