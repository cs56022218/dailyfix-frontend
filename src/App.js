import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Signup from "./page/Signup";
import Login from "./page/Login";
import ProfilePage from "./page/Profile";
import DailyReportPage from "./page/DailyReport";
import IssuePage from "./page/Issue";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotifyProvider } from "./contexts/NotifyContext"; // Import NotifyProvider

function App() {
  return (
    <AuthProvider>
      <NotifyProvider>
        <Router>
          <div>
            <section>
              <Routes>
                <Route
                  path="/home"
                  element={<ProtectedRoute component={<Home />} />}
                >
                  <Route
                    path="profile"
                    element={<ProtectedRoute component={<ProfilePage />} />}
                  />
                  <Route
                    path="daily-report"
                    element={<ProtectedRoute component={<DailyReportPage />} />}
                  />
                  <Route
                    path="issue"
                    element={<ProtectedRoute component={<IssuePage />} />}
                  />
                </Route>
                <Route
                  path="/signup"
                  element={<AuthRedirect component={<Signup />} />}
                />
                <Route
                  path="/login"
                  element={<AuthRedirect component={<Login />} />}
                />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </section>
          </div>
        </Router>
      </NotifyProvider>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ component }) => {
  const { user } = useAuth();
  return user ? component : <Navigate to="/login" />;
};

const AuthRedirect = ({ component }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/home" /> : component;
};

export default App;
