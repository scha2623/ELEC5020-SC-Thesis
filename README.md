## Prescription Management System on Blockchain

This project is a **smart-contract** based application that interfaces with a web application consisting of a frontend and backend. As such, there are three main parts of the codebase that need to be compiled and deployed in a specific order.

### Prerequisites

- Ganache (or other Ethereum Testnet)
- Node.js 16.15.1 or newer
- Access to Remix IDE

### Deploy the Smart Contract
- First run Ganache and quickstart a new instance of the blockchain. Ensure it is running on `127.0.0.1:7545`, otherwise the `.env` file in the backend will need to be updated with the correct IP and port.

- Open Remix IDE and navigate to the folder under `\backend\src\contracts` and load the `PrescriptionManagementSolution.sol` file into the IDE.

- Compile the code, using Solidity version 0.8.0 Istanbul. You may need to enable the optimizations flag in Remix for the contract to build successfully.

- The code can then be deployed in Remix to Ganache, using one of the available wallet addresses - keep a note of this address as it will be used as the Administrator Address. Also keep a note of the contract deployment address. 

- You can verify that the contract has been deployed by going to Ganache and looking for the specific transaction under Transactions tab.

- When this is done, open the `.env` file that is present in `\backend` and update the variables for administrator address (ADMIN_ADDRESS) and contract deployment address (CONTRACT_ADDRESS), and save.

### Run the Backend
- Open a terminal and navigate to `\backend`. First, install all dependencies by running:
`npm i`

- To run the application, run the following command:

`npm run backend`

- If this is successful, the application will start without errors and display the current block number in Ganache.

### Start the Frontend

- Open a separate terminal and navigate to `\frontend`. First, install all dependencies by running:

`npm i`

- To run the application, run the following command:

`npm run start`

- The terminal may warn the user to use a separate port if there is a clash with the backend, just press Y to use a new port if this is the case.

- The web application should automatically launch in your system's browser to a landing page consisting of buttons to load the various views.

- You can input a wallet address of a valid doctor to open the Doctor view.

- Similarly, you can input the wallet address of a valid patient to open the Patient view.
