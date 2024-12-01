import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext"; // นำเข้า useAuth
import { useNotify } from "../contexts/NotifyContext"; // นำเข้า useNotify
import {
  Drawer,
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

const drawerWidth = 250;

const Home = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); // ใช้ useAuth เพื่อดึงข้อมูลผู้ใช้
  const { notify } = useNotify(); // เรียกใช้ notify

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        notify("Signed out successfully", "success"); // แจ้งเตือนเมื่อออกจากระบบสำเร็จ
        navigate("/login");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
        notify("Error signing out: " + error.message, "error"); // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
      });
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`,
            ml: drawerOpen ? `${drawerWidth}px` : 0,
            transition: "width 0.3s, margin 0.3s",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2, ...(drawerOpen && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Dashboard
            </Typography>
            {/* แสดงอีเมลของผู้ใช้ที่ล็อกอิน */}
            {user && (
              <Typography variant="body1" sx={{ ml: 2 }}>
                Welcome, {user.email}
              </Typography>
            )}
          </Toolbar>
        </AppBar>

        {/* Persistent Drawer */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#1e1e1e",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            {/* Close Drawer Button */}
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon color="primary" />
            </IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Menu
            </Typography>
            <List>
              <ListItem
                sx={{ cursor: "pointer" }}
                button
                onClick={() => navigate("/home/profile")}
              >
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem
                sx={{ cursor: "pointer" }}
                button
                onClick={() => navigate("/home/daily-report")}
              >
                <ListItemText primary="Daily Report" />
              </ListItem>
              <ListItem
                sx={{ cursor: "pointer" }}
                button
                onClick={() => navigate("/home/issue")}
              >
                <ListItemText primary="Issue" />
              </ListItem>
            </List>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </Box>
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`,
            transition: "width 0.3s",
          }}
        >
          {/* Outlet is where child routes will render */}
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
