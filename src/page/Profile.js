import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { auth, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useNotify } from "../contexts/NotifyContext"; // Import useNotify
import { updateUser } from "../api/userApi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const { notify } = useNotify(); // Use useNotify from NotifyContext

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setNewDisplayName(currentUser.displayName || "");
      const avatarRef = ref(storage, `avatars/${currentUser.uid}`);
      getDownloadURL(avatarRef)
        .then((url) => {
          setAvatarURL(url);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching avatar:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewAvatar(null);
    setNewDisplayName(user.displayName || "");
  };

  const handleUpdateProfile = async () => {
    try {
      if (newDisplayName) {
        await updateProfile(auth.currentUser, {
          displayName: newDisplayName,
        });
        await updateUser(auth.currentUser.uid, { name: newDisplayName });
        notify("Display name updated successfully", "success"); // Notify on success
      }
      if (newAvatar) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, newAvatar);
        const url = await getDownloadURL(avatarRef);
        setAvatarURL(url);
        await updateUser(auth.currentUser.uid, { avatarURL: url });

        notify("Avatar updated successfully", "success"); // Notify on success
      }
      handleClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      notify(`Failed to update profile: ${error.message}`, "error"); // Notify on error
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ textAlign: "center", mt: 4, mx: 2 }}>
      {user && (
        <>
          <Avatar
            alt={user.displayName || "User Avatar"}
            src={avatarURL}
            sx={{ width: 100, height: 100, margin: "auto", mb: 2 }}
          />
          <Typography variant="h4" color="primary" gutterBottom>
            {user.displayName || "User Name"}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
            Email: {user.email}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            User ID: {user.uid}
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleOpen}>
            Edit Profile
          </Button>

          {/* Modal for editing profile */}
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Edit Profile
              </Typography>
              <TextField
                fullWidth
                label="Display Name"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewAvatar(e.target.files[0])}
                style={{ marginBottom: "16px" }} // เพิ่ม margin
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleUpdateProfile}>
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Modal>
        </>
      )}
      {!user && (
        <Typography variant="h6" color="error">
          User not logged in.
        </Typography>
      )}
    </Box>
  );
};

export default Profile;
