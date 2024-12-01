import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { auth } from "../firebase";
import {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
} from "../api/issueApi";
import { useNotify } from "../contexts/NotifyContext";
import moment from "moment";
import { getUsers } from "../api/userApi";

const IssuePage = () => {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]); // State to hold users for assigned_to
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { notify } = useNotify();
  const currentUser = auth.currentUser;

  // Fetch issues on component mount
  const fetchIssues = async () => {
    try {
      const data = await getIssues();
      setIssues(data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const userData = await getUsers(); // Call the API to get users
      setUsers(userData); // Set the users state with data from API
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchIssues();
    fetchUsers(); // Fetch users on component mount
  }, []);

  const handleOpenModal = (issue) => {
    // ตรวจสอบถ้า status เป็น closed ไม่ให้แก้ไข
    if (issue && issue.status === "closed") {
      notify("Cannot edit a closed issue", "warning"); // แสดงแจ้งเตือนว่าไม่สามารถแก้ไขได้
      return;
    }

    setSelectedIssue({
      ...issue,
      assigned_to: issue?.assigned_to?.uid || "", // Set assigned_to to user uid
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedIssue(null);
  };

  const handleDelete = async (id) => {
    // ค้นหา issue ที่จะลบจาก state issues
    const issueToDelete = issues.find((issue) => issue._id === id);

    // ตรวจสอบถ้า status เป็น closed ไม่ให้ลบ
    if (issueToDelete && issueToDelete.status === "closed") {
      notify("Cannot delete a closed issue", "warning"); // แสดงแจ้งเตือนว่าไม่สามารถลบได้
      return;
    }

    try {
      await deleteIssue(id);
      setIssues(issues.filter((issue) => issue._id !== id)); // Remove deleted issue from state
      notify("Issue deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting issue:", error);
      notify("Error deleting issue", "error");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      if (selectedIssue._id) {
        // Update existing issue
        await updateIssue(selectedIssue._id, {
          ...selectedIssue,
          assigned_to: selectedIssue.assigned_to, // ใช้ uid ของ assigned_to ที่เลือก
          created_by: currentUser.uid,
        });
        notify("Issue updated successfully", "success");
      } else {
        // Create new issue
        await createIssue({
          ...selectedIssue,
          assigned_to: selectedIssue.assigned_to, // ใช้ uid ของ assigned_to ที่เลือก
          created_by: currentUser.uid,
        });
        notify("Issue created successfully", "success");
      }
      handleCloseModal();

      // ดึงข้อมูล issues ทั้งหมดอีกครั้ง
      fetchIssues();
    } catch (error) {
      console.error("Error saving issue:", error);
      notify("Error saving issue", "error");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "issue_type", headerName: "Issue Type", flex: 1 },
    { field: "priority", headerName: "Priority", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    // {
    //   field: "assigned_to",
    //   headerName: "Assigned To",
    //   flex: 1,
    //   valueGetter: (params) => params.row.assigned_to?.name || "", // Extract assigned_to name
    // },
    {
      field: "issue_date",
      headerName: "Issue Date",
      flex: 1,
      renderCell: (params) => {
        const date = params.value
          ? moment(params.value).format("DD/MM/YYYY HH:mm:ss")
          : "";
        return date;
      },
    },
    {
      field: "ship_date",
      headerName: "Ship Date",
      flex: 1,
      renderCell: (params) => {
        const date = params.value
          ? moment(params.value).format("DD/MM/YYYY HH:mm")
          : "";
        return date;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenModal(params.row)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal(null)}
        sx={{ mb: 2 }}
      >
        Add Issue
      </Button>
      <DataGrid
        rows={issues.map((issue) => ({
          ...issue,
          id: issue._id,
        }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        loading={loading}
        autoHeight
        sx={{
          height: "100vh",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#2C2C2C",
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: 16,
          },
          "& .MuiDataGrid-row": {
            "&:nth-of-type(even)": { backgroundColor: "#1F1F1F" },
            "&:nth-of-type(odd)": { backgroundColor: "#2C2C2C" },
            "& .MuiDataGrid-cell": { color: "#FFFFFF", padding: "10px" },
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#2C2C2C",
            color: "#FFFFFF",
          },
        }}
      />

      <Modal open={openModal} onClose={handleCloseModal}>
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
            minWidth: 400,
          }}
        >
          {selectedIssue ? (
            <form onSubmit={handleSave}>
              <Typography variant="h6" gutterBottom>
                {selectedIssue._id ? "Edit Issue" : "Add Issue"}
              </Typography>

              {/* Issue Type Field */}
              <FormControl fullWidth sx={{ mb: 2 }} required>
                <InputLabel>Issue Type</InputLabel>
                <Select
                  value={selectedIssue.issue_type || ""}
                  onChange={(e) =>
                    setSelectedIssue({
                      ...selectedIssue,
                      issue_type: e.target.value,
                    })
                  }
                >
                  <MenuItem value="request">Request</MenuItem>
                  <MenuItem value="bug">Bug</MenuItem>
                </Select>
              </FormControl>

              {/* Assigned By Select */}
              <FormControl fullWidth sx={{ mb: 2 }} required>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={selectedIssue.assigned_to || ""}
                  onChange={(e) =>
                    setSelectedIssue({
                      ...selectedIssue,
                      assigned_to: e.target.value,
                    })
                  }
                >
                  {users.map((user) => (
                    <MenuItem key={user.uid} value={user.uid}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Priority Select */}
              <FormControl fullWidth sx={{ mb: 2 }} required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={selectedIssue.priority || ""}
                  onChange={(e) =>
                    setSelectedIssue({
                      ...selectedIssue,
                      priority: e.target.value,
                    })
                  }
                >
                  <MenuItem value="minor">Minor</MenuItem>
                  <MenuItem value="major">Major</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>

              {/* Status Select */}
              <FormControl fullWidth sx={{ mb: 2 }} required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedIssue.status || ""}
                  onChange={(e) =>
                    setSelectedIssue({
                      ...selectedIssue,
                      status: e.target.value,
                    })
                  }
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                </Select>
              </FormControl>

              {/* Note Field */}
              <TextField
                fullWidth
                label="Note"
                multiline
                minRows={3}
                value={selectedIssue.note || ""}
                onChange={(e) =>
                  setSelectedIssue({
                    ...selectedIssue,
                    note: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />

              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCloseModal}
                  sx={{ ml: 2 }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default IssuePage;
