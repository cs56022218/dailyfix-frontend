import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNotify } from "../contexts/NotifyContext"; // Import useNotify

// Custom theme with dark colors (same as Signup page)
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Soothing blue
    },
    secondary: {
      main: "#f48fb1", // Soft pink
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { notify } = useNotify(); // Use useNotify from NotifyContext

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/home");
        notify("Login successful", "success"); // Notify on success
        console.log(user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        notify(`Login failed: ${errorMessage}`, "error"); // Notify on error
        console.log(error.code, errorMessage);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh", // Full screen height
          backgroundColor: "#232323", // Same background color as Signup page
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "background.paper",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              color="primary"
              gutterBottom
            >
              Login
            </Typography>
            <form onSubmit={onLogin}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
            </form>
            <Typography variant="body2" sx={{ color: "white" }}>
              No account yet?{" "}
              <Link component={NavLink} to="/signup" color="secondary">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
