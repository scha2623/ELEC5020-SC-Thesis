import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import AdministratorView from "./AdministratorView/AdministratorView";
import DoctorView from "./DoctorView/DoctorView";
import { Button, Box, Typography, TextField } from "@mui/material";
import PatientView from "./PatientView/PatientView";
import React, { useEffect, useState } from "react";

function App() {
  const [patientAddress, setPatientAddress] = useState(
    "0xF3053A1170ed4C43dFC38AF5fC4a3fe674248cF9"
  );
  const [doctorAddress, setDoctorAddress] = useState(
    "0x93985730C34307aa0A83b39196c780A583993d9A"
  );

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdministratorView />} />
        <Route path="/doctor/:doctorAddress" element={<DoctorView />} />
        <Route path="/patient/:patientAddress" element={<PatientView />} />
        <Route
          path="/"
          element={
            <>
              <Box sx={{ p: 2, gap: 10, display: "flex" }}>
                <Typography>
                  Welcome to the Prescription Manager Demo! Please choose a
                  view.
                </Typography>
              </Box>
              <Button variant="contained" color="primary" href="/admin">
                Administrator View
              </Button>
              <Box sx={{ p: 2, gap: 10, display: "flex" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  href={`/doctor/${doctorAddress}`}
                >
                  Doctor View
                </Button>
                <TextField
                  autoFocus
                  required
                  id="doctorAddress"
                  name="doctorAddress"
                  helperText="Please enter doctor's wallet address"
                  type="text"
                  defaultValue={doctorAddress}
                  variant="standard"
                  inputProps={{ maxLength: 1000 }}
                  onChange={(event) => {
                    console.log(event.target.value);
                    setDoctorAddress(event.target.value);
                  }}
                />
              </Box>
              <Box sx={{ p: 2, gap: 10, display: "flex" }}>
                <Button
                  variant="contained"
                  color="tertiary"
                  href={`/patient/${patientAddress}`}
                >
                  Patient View
                </Button>
                <TextField
                  autoFocus
                  required
                  id="patientAddress"
                  name="patientAddress"
                  type="text"
                  defaultValue={patientAddress}
                  helperText="Please enter patient's wallet address"
                  variant="standard"
                  inputProps={{ maxLength: 1000 }}
                  onChange={(event) => {
                    console.log(event.target.value);
                    setPatientAddress(event.target.value);
                  }}
                />
              </Box>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
