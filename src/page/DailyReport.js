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

import {
  getDailyReports,
  createDailyReport,
  updateDailyReport,
  deleteDailyReport,
} from "../api/dailyReportAPI"; // Import API functions
import { useNotify } from "../contexts/NotifyContext"; // Import Notify context

const DailyReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { notify } = useNotify(); // Use the notify function from context

  // Fetch the daily reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getDailyReports();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Handle opening the modal to edit or add a report
  const handleOpenModal = (report) => {
    setSelectedReport(report || {}); // If null, initialize with an empty object for new entry
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedReport(null);
  };

  // Handle deleting a report
  const handleDelete = async (id) => {
    try {
      await deleteDailyReport(id);
      setReports(reports.filter((report) => report._id !== id)); // Remove deleted report from state
      notify("Report deleted successfully", "success"); // Notify on success
    } catch (error) {
      console.error("Error deleting report:", error);
      notify("Error deleting report", "error"); // Notify on error
    }
  };

  // Handle saving (create/update) a report
  const handleSave = async () => {
    try {
      if (selectedReport._id) {
        // Update existing report
        await updateDailyReport(selectedReport._id, selectedReport);
        setReports(
          reports.map((report) =>
            report._id === selectedReport._id ? selectedReport : report
          )
        );
        notify("Report updated successfully", "success"); // Notify on success
      } else {
        // Create new report
        const newReport = await createDailyReport(selectedReport);
        setReports([...reports, newReport]);
        notify("Report created successfully", "success"); // Notify on success
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving report:", error);
      notify("Error saving report", "error"); // Notify on error
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "task", headerName: "Task", flex: 1 },
    { field: "type_work", headerName: "Type of Work", flex: 1 },
    { field: "problem", headerName: "Problem", flex: 1 },
    { field: "due_date", headerName: "Due Date", flex: 1, type: "date" },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "ship_date", headerName: "Ship Date", flex: 1, type: "date" },
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
        sx={{ mb: 2 }} // เพิ่มช่องว่างด้านล่างของปุ่ม
      >
        Add Daily Report
      </Button>
      <DataGrid
        rows={reports.map((report) => ({ ...report, id: report._id }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        loading={loading}
        autoHeight
        sx={{
          height: "100vh",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#2C2C2C", // พื้นหลังเข้มสำหรับหัวตาราง
            color: "#FFFFFF", // สีตัวอักษรสว่างสำหรับหัวตาราง
            fontWeight: "bold",
            fontSize: 16,
          },
          "& .MuiDataGrid-row": {
            "&:nth-of-type(even)": {
              backgroundColor: "#1F1F1F", // สีพื้นหลังเข้มสำหรับแถวเลขคู่
            },
            "&:nth-of-type(odd)": {
              backgroundColor: "#2C2C2C", // สีพื้นหลังเข้มสำหรับแถวเลขคี่
            },
            "& .MuiDataGrid-cell": {
              color: "#FFFFFF", // สีตัวอักษรสำหรับเซลล์ตาราง
              padding: "10px", // เพิ่ม padding ให้เซลล์ของตาราง
            },
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#2C2C2C", // สีพื้นหลังของ footer
            color: "#FFFFFF", // สีตัวอักษรของ footer
          },
        }}
        componentsProps={{
          pagination: {
            sx: {
              backgroundColor: "#2C2C2C", // สีพื้นหลัง pagination
              color: "#FFFFFF", // สีตัวอักษร pagination
            },
          },
        }}
      />

      {/* Modal for showing and editing details */}
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
          {selectedReport ? (
            <form onSubmit={handleSave}>
              <Typography variant="h6" gutterBottom>
                {selectedReport._id ? "Edit Report" : "Add Report"}
              </Typography>

              {/* Task Field */}
              <TextField
                fullWidth
                disabled={selectedReport._id}
                label="Task"
                value={selectedReport.task || ""}
                onChange={(e) =>
                  setSelectedReport({ ...selectedReport, task: e.target.value })
                }
                sx={{ mb: 2 }}
                required
              />

              {/* Type of Work Select */}
              <FormControl fullWidth sx={{ mb: 2 }} required>
                <InputLabel>Select Type of Work</InputLabel>
                <Select
                  disabled={selectedReport._id}
                  value={selectedReport.type_work || ""}
                  onChange={(e) =>
                    setSelectedReport({
                      ...selectedReport,
                      type_work: e.target.value,
                    })
                  }
                >
                  <MenuItem value="" disabled>
                    Select Type of Work
                  </MenuItem>
                  <MenuItem value="WFH">Work from Home</MenuItem>
                  <MenuItem value="WFO">Work from Office</MenuItem>
                </Select>
              </FormControl>

              {/* Problem Field */}
              <TextField
                fullWidth
                label="Problem"
                disabled={selectedReport._id}
                required
                value={selectedReport.problem || ""}
                onChange={(e) =>
                  setSelectedReport({
                    ...selectedReport,
                    problem: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />

              {/* Status Select */}
              <FormControl fullWidth sx={{ mb: 2 }} required>
                <InputLabel>Select Status</InputLabel>
                <Select
                  value={selectedReport.status || ""}
                  onChange={(e) =>
                    setSelectedReport({
                      ...selectedReport,
                      status: e.target.value,
                    })
                  }
                >
                  <MenuItem value="" disabled>
                    Select Status
                  </MenuItem>
                  <MenuItem value="inprogress">In Progress</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                </Select>
              </FormControl>

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

export default DailyReportPage;
