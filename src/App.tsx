import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { pb } from "./lib/pocketbase";
import Auth from "./pages/auth";
import Home from "./pages/home";
import ReadLetters from "./pages/read_letters";
import { getCurrentUser } from "./utils/auth";
import Navbar from "./components/navbar";

// Middleware component
const RequireAuth = () => {
  const isAuthenticated = pb.authStore.isValid; // Check if the session is valid
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

const PrivateLayout = () => {
  return (
    <div>
      <Navbar user={getCurrentUser()} onSignOut={() => pb.authStore.clear()} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/auth" element={<Auth />} />

        {/* Private route */}
        <Route element={<RequireAuth />}>
          <Route element={<PrivateLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/read" element={<ReadLetters />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;