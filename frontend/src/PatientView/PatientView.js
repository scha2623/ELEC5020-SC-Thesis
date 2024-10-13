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

const baseUrl = "http://localhost:3000/api/ethereum/patient/";

export default function PatientView() {
  const { patientAddress } = useParams();
  console.log(patientAddress);
  const [doctors, setDoctors] = useState([]);

  const [isPrescriptionInfoOpen, setPrescriptionInfoOpen] = useState(false);
  const [curAddr, setCurAddr] = useState("");
  const [curDoctor, setCurDoctor] = useState();
  const [curPrescriptions, setCurPrescriptions] = useState([]);

  const handlePrescriptionInfoOpen = () => setPrescriptionInfoOpen(true);
  const handlePrescriptionInfoClose = () => setPrescriptionInfoOpen(false);

  const doctorsColumns = [
    { field: "doctorName", headerName: "Doctor Name", flex: 1, minWidth: 400 },
    {
      field: "doctorEthAddress",
      headerName: "Doctor Wallet ID",
      flex: 1,
      minWidth: 400,
      sortable: false,
      filterable: false,
    },

    {
      field: "doctorLocation",
      headerName: "Location",
      flex: 1,
      minWidth: 400,
      sortable: false,
      filterable: false,
    },
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
            variant="outlined"
            onClick={async () => {
              setCurDoctor(params.row);
              setCurAddr(params.row.doctorAddress);
              await getPrescriptionsForDoctor(params.row.doctorEthAddress);
              handlePrescriptionInfoOpen();
            }}
          >
            View Prescriptions
          </Button>
        </Box>
      ),
    },
  ];

  const prescriptionColumns = [
    { field: "treatment", headerName: "Treatment", flex: 1, minWidth: 400 },
    { field: "notes", headerName: "Additional Notes", flex: 1, minWidth: 400 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await axios.get(baseUrl + "viewMyDoctors/" + patientAddress);
      let userList = resp.data.result;
      const key = "doctorEthAddress";
      userList = [
        ...new Map(userList.map((item) => [item[key], item])).values(),
      ];
      userList.forEach((element) => {
        element.doctorName = "Dr. " + element.doctorName;
        element.status = CurStatus[element.status];
        element.role = Roles[element.role];
      });
      setDoctors(userList);
    } catch (error) {
      console.error("Failed to fetch data", error);
      alert("Failed to load doctors.");
    }
  };

  const getPrescriptionsForDoctor = async (doctorEthAddress) => {
    try {
      const resp = await axios.get(
        baseUrl +
          "getPrescriptionsByDoctor" +
          "/" +
          patientAddress +
          "/" +
          doctorEthAddress
      );
      let prescriptionList = resp.data.result;
      prescriptionList.forEach((element, i) => {
        element.id = i + 1;
        console.log(element);
      });
      setCurPrescriptions(prescriptionList);
    } catch (error) {
      alert("Failed to get prescriptions for doctor.");
    }
  };

  function getPrescriptionDialog() {
    return (
      <Dialog
        maxWidth="false"
        open={isPrescriptionInfoOpen}
        onClose={handlePrescriptionInfoClose}
      >
        <DialogTitle>Prescriptions List</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Viewing prescriptions from {curDoctor?.doctorName}
          </DialogContentText>
          <DialogContentText>
            Location: {curDoctor?.doctorLocation}
          </DialogContentText>
          <DialogContentText>
            Doctor Wallet Address: {curDoctor?.doctorEthAddress}
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
          <Button onClick={handlePrescriptionInfoClose}>Close</Button>
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
          Patient View
        </Typography>
        <Typography gutterBottom color="#000">
          {patientAddress}
        </Typography>
        <Box sx={{ backgroundColor: "white", borderRadius: 1, p: 1 }}>
          <Typography gutterBottom color="#000">
            Viewing your current doctors/providers:
          </Typography>
          <DataGrid
            disableRowSelectionOnClick
            rows={doctors}
            columns={doctorsColumns}
            getRowId={(row) => row.doctorEthAddress}
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
      {getPrescriptionDialog()}
    </Box>
  );
}
