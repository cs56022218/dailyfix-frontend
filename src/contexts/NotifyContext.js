import React, { createContext, useContext, useState } from "react";
import { Snackbar } from "@mui/material";

const NotifyContext = createContext();

export const NotifyProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success"); // 'success' or 'error'

  const notify = (msg, severity = "success") => {
    setMessage(msg);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <NotifyContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        anchorOrigin={{ vertical: "center", horizontal: "center" }} // Centered position
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: severity === "success" ? "green" : "red", // Change color based on severity
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            textAlign: "center", // Center text
          },
        }}
      />
    </NotifyContext.Provider>
  );
};

export const useNotify = () => {
  return useContext(NotifyContext);
};
