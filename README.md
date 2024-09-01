## Modern Todo App with User Authentication

This is a modern Todo app built with Node.js, Express, MongoDB, and Nodemailer. It features user authentication, password reset functionality, and a user-friendly interface.

**Features:**

- **User Authentication:**
    - Sign up and register new users.
    - Securely store user passwords using bcrypt.
    - Login using email and password.
    - Logout functionality.
- **Password Reset:**
    - Send secure OTPs via email using Nodemailer.
    - Verify OTPs to confirm user identity.
    - Reset user passwords after verification.
- **Todo List:**
    - Add new todo items.
    - Mark todo items as completed.
    - Delete todo items.
    - Store todo data in MongoDB.
    - Search for specific items.
    - Sort items by various criteria.
- **User-Friendly Interface:**
    - Clean and modern design with a responsive layout.
    - Easy-to-use features for managing todo lists.

**Dependencies:**

- `express`: For building the web server.
- `mongodb`: For interacting with the MongoDB database.
- `nodemailer`: For sending emails.
- `bcrypt`: For hashing passwords.
- `crypto`: For generating secure OTPs.
- `zxcvbn`: For password strength checking (used in the password reset page).

**Running the Application:**

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup MongoDB:**
   - Ensure MongoDB is running on your machine.
   - Create a database named `todoApp`.
   - create collections named `users`, `otps`, `todos`.

3. **Replace Email Credentials:**
   - In `server.js`, replace `"REPLACE WITH YOUR OWN EMAIL"` with your actual email address and `"REPLACE WITH YOUR OWN APP PASSWORD"` with your app password for sending emails.

4. **Run the Server:**
   ```bash
   nodemon main.js
   ```

   The server will start listening on port 8000.

5. **Access the App:**
   - Open your browser and navigate to `http://localhost:8000`.

**Instructions:**

- The application will guide you through registration, login, and password reset processes.
- Once logged in, you can start adding and managing your todo items.
