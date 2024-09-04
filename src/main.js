const express = require("express");
const { ObjectId } = require("mongodb");
const path = require("path");
const { connectToDatabase } = require("./Utilities/db");
const {
  sendOTP,
  login,
  register,
  verifyOTP,
  updatePassword,
  logout,
  verifyToken,
} = require("./server");
const app = express();
const port = 8000;
let currentUserEmail = "";

app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "Static")));

app.get("/", (req, res) => {
  res.sendFile("templates/index.html", { root: __dirname });
});

app.get("/reset", (req, res) => {
  res.sendFile("templates/SubmitEmail.html", { root: __dirname });
});

app.get("/OTP", (req, res) => {
  res.sendFile("templates/OTPVerification.html", { root: __dirname });
});

app.post("/reset", (req, res) => {
  const { email } = req.body;

  sendOTP(
    "REPLACE WITH YOUR OWN EMAIL",
    "REPLACE WITH YOUR OWN APP PASSWORD",
    email
  )
    .then(() => {
      res.json({ message: "OTP sent successfully" });
    })
    .catch((error) => {
      console.error("Failed to send OTP", error);
      res.status(500).json({ message: "Failed to send OTP" });
    });
});

app.get("/verify-token", async (req, res) => {
  // Add async here
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const result = await verifyToken(token);
    if (result.isValid) {
      res.json({ isValid: true, email: result.email });
    } else {
      res
        .status(401)
        .json({ isValid: false, message: "Invalid or expired token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const loginResult = await login(email, password);
    if (loginResult.success) {
      console.log("Login successful!");
      currentUserEmail = loginResult.email;
      res.json({
        message: "Login successful",
        email: currentUserEmail,
        token: loginResult.token,
      });
    } else {
      console.log("Login failed!");
      res.status(401).json({ message: "Login failed" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/register", (req, res) => {
  res.sendFile("templates/register.html", { root: __dirname });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const registerSuccessful = await register(name, email, password);
    if (registerSuccessful) {
      console.log("Registeration successful!");
      res.json({ message: "Registeration successful" });
    } else {
      console.log("Registeration failed!");
      res.status(401).json({ message: "Registeration failed!" });
    }
  } catch (error) {
    console.error("login error:", error);
    res.sendStatus(500).json({ message: "Internal sever error" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const isValid = await verifyOTP(email, otp);
    if (isValid) {
      res.json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/home", (req, res) => {
  res.sendFile("templates/home.html", { root: __dirname });
});

app.get("/reset-password", (req, res) => {
  res.sendFile("templates/ResetPassword.html", { root: __dirname });
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const passwordUpdated = await updatePassword(email, newPassword);
    if (passwordUpdated) {
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update password" });
    }
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/user", (req, res) => {
  if (currentUserEmail) {
    res.json({ email: currentUserEmail });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

app.get("/session/user", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const result = await verifyToken(token);
    if (result.isValid) {
      res.json({ email: result.email });
    } else {
      res.status(401).json({ message: "Not logged in" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/todos", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { email } = req.query;
    const todos = await db.collection("todos").find({ email }).toArray();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching todos" });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { text, email } = req.body;
    const result = await db
      .collection("todos")
      .insertOne({ text, completed: false, email });
    res
      .status(201)
      .json({ _id: result.insertedId, text, completed: false, email });
  } catch (error) {
    res.status(500).json({ error: "Error creating todo" });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { id } = req.params;
    const { completed } = req.body;
    await db
      .collection("todos")
      .updateOne({ _id: new ObjectId(id) }, { $set: { completed } });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "Error updating todo" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { id } = req.params;
    await db.collection("todos").deleteOne({ _id: new ObjectId(id) });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "Error deleting todo" });
  }
});

app.post("/logout", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const logoutResult = await logout(email);
    if (logoutResult.success) {
      currentUserEmail = "";
      res.json({ message: logoutResult.message });
    } else {
      res.status(400).json({ message: logoutResult.message });
    }
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error during logout" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
