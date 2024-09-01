## Explaination.md

This document provides a detailed explanation of the Todo App codebase, designed to help developers understand its architecture, functionalities, and underlying technologies. 

### 1. Project Overview

This Todo App is a simple yet comprehensive web application built with Node.js, Express.js, MongoDB, and Nodemailer. It allows users to:

* **Register** with email and password.
* **Login** to access their todo lists.
* **Create** new todo items.
* **Mark** todo items as completed.
* **Delete** todo items.
* **Search** for specific todos within their list.
* **Sort** their todo lists by various criteria.
* **Reset** their passwords through email verification and password strength validation.
* **Logout** from the application.

The application utilizes a user-friendly interface built with HTML, CSS, and JavaScript, and provides a smooth user experience with features like custom alerts and theming.

### 2. Codebase Structure

```
todo-app/
│   main.js
│   server.js
│
├───Static
│   ├───CSS
│   │       home.css
│   │       index.css
│   │       OTPVerification.css
│   │       register.css
│   │       ResetPassword.css
│   │       SubmitEmail.css
│   │
│   ├───JS
│   │       home.js
│   │       index.js
│   │       OTPVerification.js
│   │       register.js
│   │       ResetPassword.js
│   │       SubmitEmail.js
│   │
│   └───modules
│           customAlert.js
│
├───templates
│       home.html
│       index.html
│       OTPVerification.html
│       register.html
│       ResetPassword.html
│       SubmitEmail.html
│
└───Utilities
        db.js

```

### 3. Technologies Used

* **Node.js:** A JavaScript runtime environment that powers the server-side logic.
* **Express.js:** A web framework for Node.js, providing routing, middleware, and other essential features.
* **MongoDB:** A NoSQL database used to store user data and todo lists.
* **Nodemailer:** A Node.js library for sending emails, used for OTP and password reset functionalities.
* **Bcrypt:** A library for hashing passwords, ensuring secure password storage.
* **HTML, CSS, JavaScript:** Technologies used to build the front-end user interface. 

### 4. Server-Side Logic (server.js)

* **Database Connection (connectToDatabase):** Establishes a connection to the MongoDB database.
* **User Authentication:**
    * **register(name, email, password):** Creates a new user account with a hashed password.
    * **login(email, password):** Authenticates users by comparing the provided password with the stored hashed password.
    * **logout(email):** Removes the user's data from the database upon logout.
* **Password Reset:**
    * **sendOTP(senderEmail, senderAppPassword, receiverEmail, additionalMessage):** Sends a one-time password (OTP) to the user's email address using Nodemailer.
    * **verifyOTP(email, enteredOTP):** Verifies the OTP entered by the user and deletes the corresponding entry from the database.
    * **updatePassword(email, newPassword):** Updates the user's password with a hashed version of the new password.

### 5. Client-Side Logic (Static/JS)

* **HTML Templates (Templates):**  Defines the structure of the web pages using HTML, including login, registration, OTP verification, password reset, and the home page.
* **CSS Styling (Static/CSS):** Styles the web pages with CSS, providing visual appeal and user-friendliness.
* **JavaScript Functionality (Static/JS):** Handles user interactions, form validation, data rendering, and communication with the server using AJAX requests.
    * **Home Page (home.js):** Renders the user's todo list, handles adding, completing, deleting, searching, and sorting of todos.
    * **Login Page (index.js):** Handles user login and redirects to the home page upon successful authentication.
    * **Registration Page (register.js):** Handles user registration and redirects to the login page upon successful registration.
    * **OTP Verification Page (OTPVerification.js):**  Handles OTP verification and redirects to the password reset page upon successful verification.
    * **Password Reset Page (ResetPassword.js):** Handles password reset and redirects to the login page upon successful password update.
    * **Submit Email Page (SubmitEmail.js):** Handles sending a password reset email and redirects to the OTP verification page.

### 6. Database Schema (MongoDB)

The MongoDB database contains two collections:

* **users:** Stores user data, including name, email, and hashed password.
* **todos:** Stores todo items for each user, including text, completion status, and email (linking the todo to the user).

### 7. Security Considerations

* **Password Hashing:** Passwords are stored securely using Bcrypt's hashing algorithm, making it difficult to recover the original password even if the database is compromised.
* **Input Validation:** Server-side code validates user inputs to prevent malicious attacks like SQL injection.
* **HTTPS:** The application should be served over HTTPS to ensure secure communication between the client and server.

### 8. Contributing

Contributions are welcome! Please refer to the contributing guidelines for more information on how to contribute.