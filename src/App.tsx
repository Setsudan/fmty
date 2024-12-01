import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { pb } from "./lib/pocketbase";
import Auth from "./pages/auth";
import Home from "./pages/home";
import ReadLetters from "./pages/read_letters";
import { getCurrentUser } from "./utils/auth";
import Navbar from "./components/navbar";
import { Profile } from "./pages/profile";
import { routesPaths } from "./constants/routes";
import NotFound from "./pages/not-found";
// Middleware component
const RequireAuth = () => {
  const isAuthenticated = pb.authStore.isValid; // Check if the session is valid
  return isAuthenticated ? <Outlet /> : <Navigate to={routesPaths.auth} replace />;
};

const PrivateLayout = () => {
  return (
    <div>
      <Navbar user={getCurrentUser()} onSignOut={() => {
        pb.authStore.clear()
        window.location.href = routesPaths.auth
      }} />
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
        <Route path={routesPaths.auth} element={<Auth />} />
        <Route path={routesPaths.notFound} element={<NotFound />} />

        {/* Private route */}
        <Route element={<RequireAuth />}>
          <Route element={<PrivateLayout />}>
            <Route path={routesPaths.home} element={<Home />} />
            <Route path={routesPaths.read} element={<ReadLetters />} />
            <Route path={routesPaths.profile} element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;