const { Web3 } = require("web3");
const fs = require("fs");
require("dotenv").config();

const provider = new Web3.providers.HttpProvider(process.env.ETHEREUM_NODE_URL);
const web3 = new Web3(provider);

// Load contract ABI and address
const contractJSON = JSON.parse(
  fs.readFileSync(
    "./src/contracts/artifacts/PrescriptionManagementSystem.json",
    "utf8"
  )
);
const contractABI = contractJSON.abi;
const contractAddress = process.env.CONTRACT_ADDRESS;
const adminAddress = process.env.ADMIN_ADDRESS;

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

const gasLimit = 6721975;

if (!web3) {
  console.error("Web3 provider is not set or invalid.");
}

web3.eth.net
  .getId()
  .then((networkId) => {
    console.log("Contract Address: " + contractAddress);
    console.log("Admin Address: " + adminAddress);
    console.log("Network ID:", networkId);
  })
  .catch((error) => console.error("Error fetching network ID:", error));

web3.eth
  .getBlockNumber()
  .then((blockNumber) => console.log("Latest block number:", blockNumber))
  .catch((error) => console.error("Error fetching block number:", error));

exports.getBalance = async (address) => {
  return BigInt(await web3.eth.getBalance(address)).toString();
};

exports.getAccounts = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      throw new Error("No accounts found in Ganache");
    }
    return accounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

// Register a new user (interacting with the contract)
exports.registerUser = async (
  EthAddress,
  title,
  firstname,
  lastname,
  location,
  role
) => {
  try {
    const fromAccount = adminAddress; // The account that will send the transaction
    console.log(EthAddress, title, firstname, lastname, location, role);
    const result = await contract.methods
      .registerNewUser(EthAddress, title, firstname, lastname, location, role)
      .send({ from: fromAccount, gas: gasLimit });

    return result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

exports.getUserInfo = async (EthAddress) => {
  try {
    const result = await contract.methods.getUserInfo(EthAddress).call();

    // Handle result, e.g., convert to BigInt or another format if needed
    const userInfo = {
      title: BigInt(result[0]).toString(),
      firstname: result[1],
      lastname: result[2],
      location: result[3],
      ethAddress: result[4],
      role: BigInt(result[5]).toString(),
      status: BigInt(result[6]).toString(),
    };

    return userInfo;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

exports.activateUser = async (userAddress) => {
  try {
    const fromAccount = adminAddress; // The account that will send the transaction

    const result = await contract.methods
      .activateUser(userAddress)
      .send({ from: fromAccount, gas: gasLimit });

    return result;
  } catch (error) {
    console.error("Error activating user:", error);
    throw error;
  }
};

exports.changeRole = async (userAddress, newRole) => {
  try {
    const fromAccount = adminAddress; // The account that will send the transaction

    const result = await contract.methods
      .changeRole(userAddress, newRole)
      .send({ from: fromAccount, gas: gasLimit });

    return result;
  } catch (error) {
    console.error("Error changing user role:", error);
    throw error;
  }
};

exports.deactivateUser = async (userAddress) => {
  try {
    const fromAccount = adminAddress; // The account that will send the transaction

    const result = await contract.methods
      .deactivateUser(userAddress)
      .send({ from: fromAccount, gas: gasLimit });

    return result;
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw error;
  }
};

exports.deleteUser = async (userAddress) => {
  try {
    const fromAccount = adminAddress; // The account that will send the transaction

    const result = await contract.methods
      .deleteUser(userAddress)
      .send({ from: fromAccount, gas: gasLimit });

    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

exports.getUsersCount = async () => {
  try {
    const result = BigInt(
      await contract.methods.getUsersCount().call()
    ).toString();
    return result;
  } catch (error) {
    console.error("Error fetching users count:", error);
    throw error;
  }
};

exports.getAllUsers = async () => {
  try {
    const result = await contract.methods
      .getAllUsers()
      .call({ from: adminAddress });
    const processedResult = result.map((user) => ({
      title: parseInt(user.title, 10),
      firstname: user.firstname,
      lastname: user.lastname,
      location: user.location,
      ethAddress: user.ethAddress,
      role: parseInt(user.role, 10),
      status: parseInt(user.status, 10),
    }));

    return processedResult;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

exports.getAllPatientsForDoctor = async (doctorAddress) => {
  try {
    const fromAccount = doctorAddress; // The account that will send the transaction
    const result = await contract.methods
      .getAllPatientsForDoctor()
      .call({ from: fromAccount });
    const processedResult = result.map((user) => ({
      title: parseInt(user.title, 10),
      firstname: user.firstname,
      lastname: user.lastname,
      location: user.location,
      ethAddress: user.ethAddress,
      role: parseInt(user.role, 10),
      status: parseInt(user.status, 10),
    }));

    return processedResult;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

exports.prescribeMedication = async (
  doctorAddress,
  EthAddress,
  treatment,
  notes
) => {
  try {
    const fromAccount = doctorAddress;
    console.log(EthAddress, treatment, notes);
    const result = await contract.methods
      .prescribeMedication(EthAddress, treatment, notes)
      .send({ from: fromAccount, gas: gasLimit });
    return result;
  } catch (error) {
    console.error("Error prescribing medication to user:", error);
    throw error;
  }
};

exports.getPatientPrescriptions = async (doctorAddress, EthAddress) => {
  try {
    const fromAccount = doctorAddress; // The account that will send the transaction
    const result = await contract.methods
      .getPatientPrescriptions(EthAddress)
      .call({ from: fromAccount });

    const processedResult = result.map(
      (prescription) => (
        console.log(prescription),
        {
          doctorAddress: prescription.doctor,
          doctorName: prescription.doctorName,
          doctorLocation: prescription.doctorLocation,
          treatment: prescription.treatment,
          notes: prescription.notes,
        }
      )
    );

    return processedResult;
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    throw error;
  }
};

exports.viewMyDoctors = async (patientAddress) => {
  try {
    const result = await contract.methods
      .viewMyDoctors()
      .call({ from: patientAddress });

    const processedResult = result.map((doctor) => ({
      doctorEthAddress: doctor.doctorAddress,
      doctorName: doctor.doctorName,
      doctorLocation: doctor.doctorLocation,
    }));

    return processedResult;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

exports.getPrescriptionsByDoctor = async (doctorAddress, patientAddress) => {
  try {
    console.log(doctorAddress);
    console.log(patientAddress);
    const result = await contract.methods
      .getPrescriptionsByDoctor(doctorAddress)
      .call({ from: patientAddress });

    const processedResult = result.map((prescription) => ({
      doctorAddress: prescription.doctor,
      doctorName: prescription.doctorName,
      doctorLocation: prescription.doctorLocation,
      treatment: prescription.treatment,
      notes: prescription.notes,
    }));

    return processedResult;
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    throw error;
  }
};
