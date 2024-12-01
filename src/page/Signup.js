import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { register } from "../api/userApi";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Input,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNotify } from "../contexts/NotifyContext"; // Import useNotify

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");
  const { notify } = useNotify();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (avatar) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, avatar);
        const url = await getDownloadURL(storageRef);
        setAvatarURL(url);

        await register({
          uid: user.uid,
          name,
          email,
          avatarURL: url,
        });
      } else {
        await register({
          uid: user.uid,
          name,
          email,
        });
      }

      notify("Signup successful! Redirecting to homepage...", "success");
      navigate("/login");
    } catch (error) {
      const errorMessage = error.message;
      notify(`Signup failed: ${errorMessage}`, "error");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#232323",
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
              Xsurface Daily Fix
            </Typography>
            <form onSubmit={onSubmit}>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                label="Name"
                autoFocus
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </form>
            <Typography variant="body2" sx={{ color: "white" }}>
              Already have an account?{" "}
              <Link component={NavLink} to="/login" color="secondary">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;
