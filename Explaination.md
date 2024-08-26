## Explanation.md

This document provides a detailed explanation of the behind-the-scenes processes involved in the Modern Todo App with User Authentication.

### User Authentication

**1. Registration:**

- **Client-side:**
    - The user fills in the registration form, including name, email, and password.
    - The form data is sent to the server via a POST request.
- **Server-side:**
    - The server receives the registration data.
    - It checks if a user with the same email already exists in the database.
    - If the email is unique, the server hashes the user's password using bcrypt, which converts it into an irreversible hash.
    - The hashed password, along with the user's name and email, is stored in the `users` collection in MongoDB.
    - The server sends a success response to the client, indicating successful registration.

**2. Login:**

- **Client-side:**
    - The user enters their email and password.
    - The form data is sent to the server via a POST request.
- **Server-side:**
    - The server receives the login data.
    - It retrieves the user's data from the `users` collection based on the provided email.
    - It compares the provided password with the stored hashed password using bcrypt's `compare()` function.
    - If the passwords match, the server creates a session for the user, indicating they are logged in.
    - The server sends a success response to the client, redirecting them to the home page.

**3. Logout:**

- **Client-side:**
    - The user clicks the Logout button.
    - A POST request is sent to the server, including the user's email.
- **Server-side:**
    - The server receives the logout request.
    - It deletes the user's todos from the `todos` collection based on the email.
    - It deletes the user's data from the `users` collection.
    - It ends the session for the user, effectively logging them out.
    - The server sends a success response to the client, redirecting them to the login page.

### Password Reset

**1. Request Password Reset:**

- **Client-side:**
    - The user clicks the "Forgot Password" link.
    - The user enters their email address.
- **Server-side:**
    - The server receives the email.
    - It checks if a user with the provided email exists in the database.
    - If the email is valid, the server generates a secure OTP (One-Time Password).
    - The OTP is stored in the `otps` collection in MongoDB, along with the user's email and the time it was generated.
    - The server sends an email to the user containing the OTP and an expiration time.

**2. OTP Verification:**

- **Client-side:**
    - The user enters the received OTP.
    - The OTP is sent to the server along with the user's email.
- **Server-side:**
    - The server receives the OTP and email.
    - It retrieves the stored OTP from the `otps` collection based on the email.
    - It checks if the entered OTP matches the stored OTP and if the OTP hasn't expired.
    - If the verification is successful, the server deletes the OTP from the `otps` collection.
    - The server sends a success response to the client, redirecting them to the password reset page.

**3. Password Update:**

- **Client-side:**
    - The user enters a new password and confirms it.
- **Server-side:**
    - The server receives the new password.
    - It hashes the new password using bcrypt.
    - It updates the user's password in the `users` collection.
    - The server sends a success response to the client, redirecting them to the login page.

### Todo List Management

**1. Adding Todos:**

- **Client-side:**
    - The user enters a new todo item in the input field.
    - The todo is sent to the server via a POST request.
- **Server-side:**
    - The server receives the todo item.
    - It stores the todo item in the `todos` collection in MongoDB, along with the user's email and an initial status of "incomplete".
    - The server sends a success response to the client, adding the new todo to the todo list.

**2. Marking Todos as Completed:**

- **Client-side:**
    - The user checks the checkbox next to a todo item.
- **Server-side:**
    - The server receives the updated todo status (completed/incomplete).
    - It updates the status of the todo item in the `todos` collection.

**3. Deleting Todos:**

- **Client-side:**
    - The user clicks the "Delete" button next to a todo item.
- **Server-side:**
    - The server receives the request to delete the todo item.
    - It deletes the todo item from the `todos` collection.

### Technical Details

- **MongoDB:** MongoDB is used as the database to store user data, OTPs, and todo items. It's a NoSQL database that offers flexible schema and scalability.
- **Nodemailer:** Nodemailer is used for sending emails, including password reset emails and OTPs. It provides a simple API for sending emails via different email providers.
- **Bcrypt:** Bcrypt is used for hashing user passwords, making them secure and preventing them from being easily accessed.
- **Crypto:** The `crypto` module is used for generating secure OTPs. It uses a secure random number generator to create unpredictable OTPs.