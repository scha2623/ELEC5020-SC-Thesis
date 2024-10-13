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
import { useParams } from "react-router-dom";

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

const baseUrl = "http://localhost:3000/api/ethereum/doctor/";

export default function DoctorView() {
  const { doctorAddress } = useParams();
  console.log(doctorAddress);

  const [users, setUsers] = useState([]);
  const [isNewPrescriptionFormOpen, setNewPrescriptionFormOpen] =
    useState(false);
  const [isPatientInfoOpen, setPatientInfoOpen] = useState(false);
  const [curAddr, setCurAddr] = useState("");
  const [curPatient, setCurPatient] = useState();
  const [curPrescriptions, setCurPrescriptions] = useState([]);

  const handleNewPrescriptionOpen = () => setNewPrescriptionFormOpen(true);
  const handleNewPrescriptionClose = () => setNewPrescriptionFormOpen(false);

  const handlePatientInfoOpen = () => setPatientInfoOpen(true);
  const handlePatientInfoClose = () => setPatientInfoOpen(false);

  const patientsColumns = [
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
      field: "ethAddress",
      headerName: "Wallet ID",
      flex: 1,
      minWidth: 400,
      sortable: false,
      filterable: false,
    },

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
          {" "}
          <Button
            color="success"
            variant="outlined"
            onClick={() => {
              setCurPatient(params.row);
              setCurAddr(params.row.ethAddress);
              handleNewPrescriptionOpen();
            }}
          >
            New Prescription
          </Button>
          <Button
            variant="outlined"
            onClick={async () => {
              setCurPatient(params.row);
              setCurAddr(params.row.ethAddress);
              await getPatientPrescriptions(params.row.ethAddress);
              handlePatientInfoOpen();
            }}
          >
            View Prescriptions
          </Button>
        </Box>
      ),
    },
  ];

  const prescriptionColumns = [
    {
      field: "doctorAddress",
      headerName: "Doctor Address",
      flex: 1,
      minWidth: 400,
    },
    {
      field: "doctorName",
      headerName: "Prescriber",
      flex: 1,
      minWidth: 400,
    },
    {
      field: "doctorLocation",
      headerName: "Location",
      flex: 1,
      minWidth: 400,
    },
    { field: "treatment", headerName: "Treatment", flex: 1, minWidth: 400 },
    { field: "notes", headerName: "Additional Notes", flex: 1, minWidth: 400 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await axios.get(
        baseUrl + "getAllPatientsForDoctor" + "/" + doctorAddress
      );
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

  const getPatientPrescriptions = async (ethAddress) => {
    try {
      const resp = await axios.get(
        baseUrl +
          "getPatientPrescriptions" +
          "/" +
          doctorAddress +
          "/" +
          ethAddress
      );
      let prescriptionList = resp.data.result;
      prescriptionList.forEach((element, i) => {
        element.id = i + 1;
        element.doctorName = "Dr. " + element.doctorName;
        console.log(element);
      });
      setCurPrescriptions(prescriptionList);
    } catch (error) {
      alert("Failed to get prescriptions for user.");
    }
  };

  async function prescribeMedication(formJson) {
    try {
      await axios.post(
        baseUrl + "prescribeMedication" + "/" + doctorAddress,
        formJson
      );
      await fetchData();
      alert("Added prescription to user!");
    } catch (error) {
      alert("Failed to prescribe to user");
    }
  }

  function getNewPrescriptionFormDialog() {
    return (
      <Dialog
        maxWidth="false"
        open={isNewPrescriptionFormOpen}
        onClose={handleNewPrescriptionClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            await prescribeMedication(formJson);
            handleNewPrescriptionClose();
          },
        }}
      >
        <DialogTitle>New Prescription</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <DialogContentText>
              Please enter the details of the prescription you want to create.
            </DialogContentText>
            <DialogContentText>
              Patient Name: {curPatient?.firstname} {curPatient?.lastname}
            </DialogContentText>

            <TextField
              autoFocus
              required
              id="address"
              name="address"
              label="Ethereum Address"
              type="text"
              value={curAddr}
              fullWidth
              inputProps={{ readOnly: true }}
            />
            <TextField
              autoFocus
              required
              id="treatment"
              name="treatment"
              label="Treatment"
              type="text"
              fullWidth
              multiline
              rows={4}
              maxRows={4}
              inputProps={{ maxLength: 1000 }}
            />
            <TextField
              autoFocus
              required
              id="notes"
              name="notes"
              label="Additional notes"
              type="text"
              fullWidth
              multiline
              rows={4}
              maxRows={4}
              inputProps={{ maxLength: 1000 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewPrescriptionClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    );
  }

  function getPatientInfoDialog() {
    return (
      <Dialog
        maxWidth="false"
        open={isPatientInfoOpen}
        onClose={handlePatientInfoClose}
      >
        <DialogTitle>Prescriptions List</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Patient Name: {curPatient?.firstname} {curPatient?.lastname}
          </DialogContentText>
          <DialogContentText>
            Patient Address: {curPatient?.ethAddress}
          </DialogContentText>
          <DialogContentText>Following data found:</DialogContentText>
          <Box sx={{ backgroundColor: "white", borderRadius: 1, p: 1 }}>
            <DataGrid
              disableRowSelectionOnClick
              rows={curPrescriptions}
              columns={prescriptionColumns}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePatientInfoClose}>Close</Button>
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
          Doctor View
        </Typography>
        <Typography gutterBottom color="#000">
          {doctorAddress}
        </Typography>
        <Box sx={{ backgroundColor: "white", borderRadius: 1, p: 1 }}>
          <Typography gutterBottom color="#000">
            Viewing all available patients for your hospital:
          </Typography>
          <DataGrid
            disableRowSelectionOnClick
            rows={users}
            columns={patientsColumns}
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
      {getNewPrescriptionFormDialog()}
      {getPatientInfoDialog()}
    </Box>
  );
}
