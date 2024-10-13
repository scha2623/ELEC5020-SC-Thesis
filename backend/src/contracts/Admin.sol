// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Admin {
    address public hospitalAdmin;

    constructor() {
        hospitalAdmin = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == hospitalAdmin,
            "Invalid access credentials. Please contact your hospital administrator."
        );
        _;
    }

    modifier onlyDoctor() {
        require(
            UsersDetails[msg.sender].exists,
            "User does not exist."
        );
        require(
            UsersDetails[msg.sender].role == Roles.Doctor,
            "Access restricted to doctors only."
        );
        _;
    }

    modifier onlyPatient() {
        require(
            UsersDetails[msg.sender].exists,
            "User does not exist."
        );
        require(
            UsersDetails[msg.sender].role == Roles.Patient,
            "Access restricted to patients only."
        );
        _;
    }

    enum Titles {
        Mr,
        Mrs,
        Ms,
        Dr
    }

    enum Roles {
        Doctor,
        Patient,
        Pharmacist
    }

    enum CurStatus {
        Active,
        Inactive
    }

    struct Prescription {
        address doctor;
        string doctorName;
        string doctorLocation;
        string treatment;
        string notes;
    }

    event UserRegistered(address indexed ethAddress, string name);
    event UserActivated(address indexed ethAddress, string name);
    event UserDeactivated(address indexed ethAddress, string name);
    event UserRoleChanged(address indexed ethAddress, string name, uint role);
    event UserDeleted(address indexed ethAddress, string name);
    event MedicationPrescribed(address indexed doctor, address indexed patient, string treatment);

    struct UserInfo {
        Titles title;
        string firstname;
        string lastname;
        string location;
        address ethAddress;
        Roles role;
        CurStatus status;
        bool exists;
        Prescription[] prescriptions;
    }

    mapping(address => UserInfo) public UsersDetails;
    address[] users;

    // Function to register a new user
    function registerNewUser(
        address ethAddress,
        uint title,
        string memory firstname,
        string memory lastname,
        string memory location,
        uint role
    ) public onlyOwner {
        require(!UsersDetails[ethAddress].exists, "User already registered.");
        require(title <= uint(Titles.Dr), "Invalid title");
        require(role <= uint(Roles.Pharmacist), "Invalid role");

        // Initialize an empty array of prescriptions for the new user
        UserInfo storage user = UsersDetails[ethAddress];
        user.title = Titles(title);
        user.firstname = firstname;
        user.lastname = lastname;
        user.location = location;
        user.ethAddress = ethAddress;
        user.role = Roles(role);
        user.status = CurStatus.Active;
        user.exists = true;

        users.push(ethAddress);

        emit UserRegistered(ethAddress, firstname);
    }

    // Function to prescribe medication to a patient
    function prescribeMedication(address patientAddress, string memory treatment, string memory notes) public onlyDoctor {
        require(UsersDetails[patientAddress].exists, "Patient does not exist.");
        require(UsersDetails[patientAddress].role == Roles.Patient, "Can only prescribe medication to patients.");

        // Concatenate first name and last name
        string memory fullName = string(abi.encodePacked(UsersDetails[msg.sender].firstname, " ", UsersDetails[msg.sender].lastname));

        // Add a new prescription to the patient's array of prescriptions with doctor's address, name, and location
        UsersDetails[patientAddress].prescriptions.push(Prescription({
            doctor: msg.sender, // Record the doctor's address
            doctorName: fullName,
            doctorLocation: UsersDetails[msg.sender].location,
            treatment: treatment,
            notes: notes
        }));

        emit MedicationPrescribed(msg.sender, patientAddress, treatment);
    }

    // Define a Doctor struct
    struct Doctor {
        address doctorAddress;
        string doctorName;
        string doctorLocation;
    }

    // Function to allow a patient to view all their doctors who prescribed medications
    function viewMyDoctors() public view onlyPatient returns (Doctor[] memory) {
        require(UsersDetails[msg.sender].exists, "Patient does not exist.");

        uint prescriptionCount = UsersDetails[msg.sender].prescriptions.length;

        // Initialize an array to hold doctors' information
        Doctor[] memory doctors = new Doctor[](prescriptionCount);

        for (uint i = 0; i < prescriptionCount; i++) {
            Prescription memory prescription = UsersDetails[msg.sender].prescriptions[i];
            doctors[i] = Doctor({
                doctorAddress: prescription.doctor,
                doctorName: prescription.doctorName,
                doctorLocation: prescription.doctorLocation
            });
        }

        return doctors;
    }

    // Function to retrieve prescriptions made by a specific doctor for the patient
    function getPrescriptionsByDoctor(address doctorAddress) public view onlyPatient returns (Prescription[] memory) {
        require(UsersDetails[msg.sender].exists, "Patient does not exist.");
        require(UsersDetails[doctorAddress].exists, "Doctor does not exist.");
        require(UsersDetails[doctorAddress].role == Roles.Doctor, "The specified address does not belong to a doctor.");

        uint count = 0;

        // First, count how many prescriptions were given by the specific doctor
        for (uint i = 0; i < UsersDetails[msg.sender].prescriptions.length; i++) {
            if (UsersDetails[msg.sender].prescriptions[i].doctor == doctorAddress) {
                count++;
            }
        }

        // Create an array to store the prescriptions by the specific doctor
        Prescription[] memory filteredPrescriptions = new Prescription[](count);
        uint index = 0;

        // Populate the array with prescriptions from the specified doctor
        for (uint i = 0; i < UsersDetails[msg.sender].prescriptions.length; i++) {
            if (UsersDetails[msg.sender].prescriptions[i].doctor == doctorAddress) {
                filteredPrescriptions[index] = UsersDetails[msg.sender].prescriptions[i];
                index++;
            }
        }

        return filteredPrescriptions;
    }

    // Function to get a patient's prescriptions including the doctor's address
    function getPatientPrescriptions(address patientAddress) public view returns (Prescription[] memory) {
        require(UsersDetails[patientAddress].exists, "Patient does not exist.");
        require(UsersDetails[patientAddress].role == Roles.Patient, "User is not a patient.");

        return UsersDetails[patientAddress].prescriptions;
    }

    // Function to deactivate a user
    function deactivateUser(address userAddress) public onlyOwner {
        require(UsersDetails[userAddress].exists, "User does not exist.");
        require(UsersDetails[userAddress].status == CurStatus.Active, "User is already inactive.");

        UsersDetails[userAddress].status = CurStatus.Inactive;
        emit UserDeactivated(userAddress, UsersDetails[userAddress].firstname);
    }

    // Function to activate a user
    function activateUser(address userAddress) public onlyOwner {
        require(UsersDetails[userAddress].exists, "User does not exist.");
        require(UsersDetails[userAddress].status == CurStatus.Inactive, "User is already active.");

        UsersDetails[userAddress].status = CurStatus.Active;
        emit UserActivated(userAddress, UsersDetails[userAddress].firstname);
    }

    // Function to change the role of a user
    function changeRole(address userAddress, uint role) public onlyOwner {
        require(UsersDetails[userAddress].exists, "User does not exist.");
        require(role <= uint(Roles.Pharmacist), "Invalid role");

        UsersDetails[userAddress].role = Roles(role);
        emit UserRoleChanged(userAddress, UsersDetails[userAddress].firstname, uint(UsersDetails[userAddress].role));
    }

    // Function to delete a user
    function deleteUser(address userAddress) public onlyOwner {
        require(UsersDetails[userAddress].exists, "User does not exist.");

        string memory firstname = UsersDetails[userAddress].firstname;

        // Remove the user from the mapping and mark as non-existent
        delete UsersDetails[userAddress];

        // Remove the user from the users array
        for (uint i = 0; i < users.length; i++) {
            if (users[i] == userAddress) {
                users[i] = users[users.length - 1]; // Move the last user to the deleted spot
                users.pop(); // Remove the last user
                break;
            }
        }

        emit UserDeleted(userAddress, firstname);
    }

    // Function to get detailed user information
    function getUserInfo(address userAddress)
        public view returns (
            uint title,
            string memory firstname,
            string memory lastname,
            string memory location,
            address ethAddress,
            uint role,
            uint status
        ) 
    {
        require(UsersDetails[userAddress].exists, "User does not exist.");
        UserInfo storage user = UsersDetails[userAddress];

        return (
            uint(user.title),
            user.firstname,
            user.lastname,
            user.location,
            user.ethAddress,
            uint(user.role),
            uint(user.status)
        );
    }

    // Function to get the number of users
    function getUsersCount() public view returns (uint count) {
        return users.length;
    }

    // Function to get user information by index
    function getUserByIndex(uint index)
        public view returns (
            uint title,
            string memory firstname,
            string memory lastname,
            string memory location,
            address ethAddress,
            uint role,
            uint status
        ) 
    {
        require(index < users.length, "Index out of bounds.");
        return getUserInfo(users[index]);
    }

    // Function to allow only doctors to view all patient details
    function getAllPatientsForDoctor() public view onlyDoctor returns (UserInfo[] memory) {
        uint patientCount = 0;

        // First, count the number of patients
        for (uint i = 0; i < users.length; i++) {
            if (UsersDetails[users[i]].role == Roles.Patient) {
                patientCount++;
            }
        }

        // Initialize an array to store patient information
        UserInfo[] memory patients = new UserInfo[](patientCount);
        uint patientIndex = 0;

        // Populate the array with patient data
        for (uint i = 0; i < users.length; i++) {
            if (UsersDetails[users[i]].role == Roles.Patient) {
                patients[patientIndex] = UsersDetails[users[i]];
                patientIndex++;
            }
        }

        return patients;
    }

    // Function to get all users' information
    function getAllUsers() public view returns (UserInfo[] memory) {
        UserInfo[] memory allUsers = new UserInfo[](users.length);
        for (uint i = 0; i < users.length; i++) {
            allUsers[i] = UsersDetails[users[i]];
        }
        return allUsers;
    }
}
