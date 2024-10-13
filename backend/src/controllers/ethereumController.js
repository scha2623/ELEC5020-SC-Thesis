const ethereumService = require("../services/ethereumService");

const convertBigIntToString = (obj) => {
  if (typeof obj === "bigint") {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertBigIntToString(value),
      ])
    );
  }
  return obj;
};

exports.getBalance = async (req, res) => {
  try {
    const balance = await ethereumService.getBalance(req.params.address);
    res.status(200).json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await ethereumService.getAccounts();
    res.status(200).json({ accounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await ethereumService.getUserInfo(req.params.address);
    res.status(200).json({ user: convertBigIntToString(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { address, title, firstname, lastname, location, role } = req.body;
    const result = await ethereumService.registerUser(
      address,
      title,
      firstname,
      lastname,
      location,
      role
    );
    res.status(201).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const result = await ethereumService.activateUser(req.params.address);
    res.status(200).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { address, newRole } = req.body;
    const result = await ethereumService.changeRole(address, newRole);
    res.status(200).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const result = await ethereumService.deactivateUser(req.params.address);
    res.status(200).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await ethereumService.deleteUser(req.params.address);
    res.status(200).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsersCount = async (req, res) => {
  try {
    const count = await ethereumService.getUsersCount();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await ethereumService.getAllUsers();
    res.status(200).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPatientsForDoctor = async (req, res) => {
  try {
    const result = await ethereumService.getAllPatientsForDoctor(
      req.params.doctorAddress
    );
    res.status(200).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.prescribeMedication = async (req, res) => {
  try {
    const { address, treatment, notes } = req.body;
    const result = await ethereumService.prescribeMedication(
      req.params.doctorAddress,
      address,
      treatment,
      notes
    );
    res.status(201).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const result = await ethereumService.getPatientPrescriptions(
      req.params.doctorAddress,
      req.params.address
    );
    res.status(200).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.viewMyDoctors = async (req, res) => {
  try {
    const result = await ethereumService.viewMyDoctors(
      req.params.patientAddress
    );
    res.status(200).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPrescriptionsByDoctor = async (req, res) => {
  try {
    const result = await ethereumService.getPrescriptionsByDoctor(
      req.params.doctorAddress,
      req.params.patientAddress
    );
    res.status(200).json({ result: convertBigIntToString(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
