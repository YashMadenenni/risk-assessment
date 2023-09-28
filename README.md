# README - Risk Assessment :memo:


This document provides instructions on how to set up and run the Risk Assessment application locally. Please follow the steps outlined below to ensure a successful installation and execution of the application.

## Requirements :hammer_and_wrench:
Before proceeding, make sure you have the following requirements installed on your machine:

- Node.js
- Express (npm package)
- Express-Sessions
- MongoDB for Node.js
- Cookie Parser (npm package)
- Multer
  ### Login Credentials
  You can either create your own credentials or use one of these credentials used during application testing <br>
  #### User
  User Email
  ```
  test@gmail.com
  ```
  Password
  ```
  test@123
  ```
  #### Admin
   ```
  testadmin@gmail.com
  ```
  Password
  ```
  test@123
  ```
  

## Installation Steps :ladder:

1. Clone the repository to your local machine.

2. Navigate to the server directory.
    ```
    cd server
    ```

3. Install the required Node.js dependencies using npm.
    ```
    npm install
    ```
4. Install the Express package.
    ```
    npm install express
    ```
5. Install MongoDB for Node.js.
    ```
    npm install mongodb
    ```
6. Install the Cookie Parser package.
    ```
    npm install cookie-parser
    ```
7. Install the express sessions package.
    ```
    npm install express-session.
    ```
8. Install the multer module
    ```
    npm multer
    ```
    
    #### Starting the Server Locally :computer:
    To start the server, follow these steps:

    1. Navigate to the server directory if you are not already there.

    2. Run the server using the Node.js command.
   ```
   node server.js
   ```
   This will start the server on PORT 8000.
   
   Once the server is running, you should see a success message indicating that the server has started. As shown below:

    Login: Connected to Database Login <br>
    Incident: Connected to Database Incident <br>
    Risks: Connected to Database Risks <br>
    Forms: Connected to Database Forms <br>
    Server: Connected to Database <br>
    Server Started in port:8000 <br>

    ### Accessing the Application :link:
    You can now access the Risk Assessment application by opening a web browser and navigating to the appropriate URL. The exact URL will      depend on the server configuration.
    Example: `http://localhost:8000/` 
## Accessing the Online Application :link:
 `https://risk-assessment.onrender.com/`

## Screenshots
### Home Page 
![alt text](https://github.com/YashMadenenni/risk-assessment/blob/afd2d8fac81c5bb1f4a9e7323bee99cc8e6cd9fe/screencapture-risk-assessment-onrender-home-html-2023-09-28-13_32_44.png)

### Submitted Form
![alt text](https://github.com/YashMadenenni/risk-assessment/blob/afd2d8fac81c5bb1f4a9e7323bee99cc8e6cd9fe/screencapture-risk-assessment-onrender-history-html-2023-09-28-13_34_31.png)

### Incident report 
![alt text](https://github.com/YashMadenenni/risk-assessment/blob/afd2d8fac81c5bb1f4a9e7323bee99cc8e6cd9fe/screencapture-risk-assessment-onrender-report-html-2023-09-28-13_35_08.png)
