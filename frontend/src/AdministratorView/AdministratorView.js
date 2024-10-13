import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export const Roles = Object.freeze({
  0: "Doctor",
  1: "Patient",
  2: "Pharmacist",
});

export const Titles = Object.freeze({
  0: "Mr",
  1: "Mrs",
  2: "Ms",
  3: "Dr",
});

export const CurStatus = Object.freeze({
  0: "Active",
  1: "Inactive",
});

const baseUrl = "http://localhost:3000/api/ethereum/";

export default function AdministratorView() {
  const [users, setUsers] = useState([]);
  const [rowSelection, setRowSelection] = useState();
  const [open, setOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState();
  const [selectedRole, setSelectedRole] = useState();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = [
    {
      field: "ethAddress",
      headerName: "Wallet ID",
      flex: 1,
      minWidth: 400,
      sortable: false,
      filterable: false,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      maxWidth: 100,
      sortable: false,
      filterable: false,
    },
    { field: "firstname", headerName: "Given Name", flex: 1, minWidth: 100 },
    { field: "lastname", headerName: "Surname", flex: 1, minWidth: 100 },
    {
      field: "location",
      headerName: "Address",
      flex: 1,
      minWidth: 100,
      sortable: false,
      filterable: false,
    },
    { field: "role", headerName: "Role", flex: 1, minWidth: 100 },
    { field: "status", headerName: "Active", flex: 1, minWidth: 100 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 400,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Button
            variant="outlined"
            color="success"
            onClick={() => activateUser(params.row.ethAddress)}
          >
            Activate
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => deactivateUser(params.row.ethAddress)}
          >
            Deactivate
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => deleteUser(params.row.ethAddress)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await axios.get(baseUrl + "getAllUsers");
      let userList = resp.data.result;
      userList.forEach((element) => {
        element.title = Titles[element.title];
        element.status = CurStatus[element.status];
        element.role = Roles[element.role];
      });
      setUsers(userList);
    } catch (error) {
      console.error("Failed to fetch data", error);
      alert("Failed to load users.");
    }
  };

  const activateUser = async (ethAddress) => {
    try {
      await axios.post(baseUrl + "activateUser" + "/" + ethAddress);
      fetchData();
    } catch (error) {
      alert("Failed to activate user");
    }
  };

  const deactivateUser = async (ethAddress) => {
    try {
      await axios.post(baseUrl + "deactivateUser" + "/" + ethAddress);
      fetchData();
    } catch (error) {
      alert("Failed to deactivate user");
    }
  };

  const deleteUser = async (ethAddress) => {
    try {
      await axios.post(baseUrl + "deleteUser" + "/" + ethAddress);
      fetchData();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  async function createUser(formJson) {
    formJson.title = selectedTitle;
    formJson.role = selectedRole;
    try {
      await axios.post(baseUrl + "createUser" + "/", formJson);
      fetchData();
    } catch (error) {
      alert("Failed to create user");
    }
  }

  function getFormDialog() {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            await createUser(formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>Create user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of the new user you want to create.
          </DialogContentText>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              autoFocus
              required
              id="address"
              name="address"
              label="Ethereum Address"
              type="text"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="title-label">Title</InputLabel>
              <Select
                labelId="title-label"
                id="title"
                value={selectedTitle}
                label="Title"
                onChange={(event) => setSelectedTitle(event.target.value)}
              >
                <MenuItem value={0}>Mr</MenuItem>
                <MenuItem value={1}>Mrs</MenuItem>
                <MenuItem value={2}>Ms</MenuItem>
                <MenuItem value={3}>Dr</MenuItem>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              required
              id="firstname"
              name="firstname"
              label="First Name"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              required
              id="lastname"
              name="lastname"
              label="Last Name"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              required
              id="location"
              name="location"
              label="Location"
              type="text"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={selectedRole}
                label="Role"
                onChange={(event) => setSelectedRole(event.target.value)}
              >
                <MenuItem value={0}>Doctor</MenuItem>
                <MenuItem value={1}>Patient</MenuItem>
                <MenuItem value={2}>Pharmacist</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        background: "linear-gradient(to bottom, #CBDAE2, #6F787C)",
        minHeight: "100vh", // Ensure it takes up full height
      }}
    >
      <Box
        sx={{
          p: 1,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" gutterBottom color="#000">
          Administrator View
        </Typography>
        <Button variant="contained" onClick={handleClickOpen} sx={{ mb: 2 }}>
          Create New User
        </Button>
        <Box sx={{ backgroundColor: "white", borderRadius: 1, p: 1 }}>
          <DataGrid
            disableRowSelectionOnClick
            rows={users}
            columns={columns}
            getRowId={(row) => row.ethAddress}
            pageSizeOptions={[5]}
            sx={{
              flexGrow: 1,
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-cell": {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{
            mt: 2,
            textAlign: "center",
            color: "#777",
            whiteSpace: "normal",
            lineHeight: 1.5,
            maxWidth: "30vw",
          }}
        >
          This application is built in React and serves as a proof of concept
          for using smart contracts in prescription data management. The Smart
          contracts are written in Solidity, and deployed using Remix for a
          Ganache instance. For an actual deployment, an Ethereum wallet
          provider such as MetaMask will be required. This application is a
          proof-of-concept built for Ethereum test networks and is not intended
          for commercial or actual use.
        </Typography>
      </Box>
      {getFormDialog()}
    </Box>
  );
}
