const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { connectToDatabase } = require("./Utilities/db");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const SECRET_KEY = fs
  .readFileSync("g:/Hamdan/Documents/APIs/JWT secret.txt", "utf8")
  .trim(); // GENERATE YOUR OWN JWT SECRET KEY AND REPLACE IT WITH YOUR OWN 

function tokenGenerator(userId, email, password) {
  const payload = {
    userId: userId,
    email: email,
    password: password,
    iat: Date.now(),
  };

  // Generate a token that expires in 30 days
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "720h" });
}

async function login(email, password) {
  const db = await connectToDatabase();
  const collection = db.collection("users");

  try {
    const user = await collection.findOne({ email: email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = tokenGenerator(user._id.toString(), email, password);
      return { success: true, email: user.email, token: token };
    }
    return { success: false };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false };
  }
}

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { isValid: true, email: decoded.email, password: decoded.password };
  } catch (error) {
    console.error("Token verification error:", error);
    return { isValid: false };
  }
}

async function register(name, email, password) {
  const db = await connectToDatabase();
  const collection = db.collection("users");

  try {
    const existingUser = await collection.findOne({ email: email });
    if (existingUser) {
      return false;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await collection.insertOne({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return true;
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
}

async function logout(email) {
  const db = await connectToDatabase();
  const userCollection = db.collection("users");
  const todoCollection = db.collection("todos");

  try {
    await todoCollection.deleteMany({ email: email });

    const result = await userCollection.deleteOne({ email: email });

    if (result.deletedCount > 0) {
      return { success: true, message: "Logout successful" };
    } else {
      return {
        success: false,
        message: "User not found or already logged out",
      };
    }
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, message: "Internal server error during logout" };
  }
}

async function sendOTP(
  senderEmail,
  senderAppPassword,
  receiverEmail,
  additionalMessage = ""
) {
  function generateSecureNumericOTP(length = 6) {
    const buffer = crypto.randomBytes(length);
    const numbers = [];
    for (let i = 0; i < length; i++) {
      numbers.push(buffer.readUInt8(i) % 10);
    }
    return numbers.join("");
  }

  const otp = generateSecureNumericOTP();

  const db = await connectToDatabase();
  const otpCollection = db.collection("otps");
  await otpCollection.insertOne({
    email: receiverEmail,
    otp: otp,
    createdAt: new Date(),
  });

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: senderEmail,
      pass: senderAppPassword,
    },
  });

  const mailOptions = {
    from: `"What To Do" <${senderEmail}>`,
    to: receiverEmail,
    subject: "Your One-Time Password (OTP)",
    text: `Your OTP is: ${otp}\n\n${additionalMessage}`,
    html: `<h2>Your OTP is: <strong>${otp}</strong></h2>
           <p>${additionalMessage}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    console.log("Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

async function verifyOTP(email, enteredOTP) {
  const db = await connectToDatabase();
  const otpCollection = db.collection("otps");

  const storedOTP = await otpCollection.findOne(
    { email: email },
    { sort: { createdAt: -1 } }
  );

  if (!storedOTP) {
    return false;
  }

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  if (storedOTP.createdAt < tenMinutesAgo) {
    return false;
  }

  if (enteredOTP === storedOTP.otp) {
    await otpCollection.deleteOne({ _id: storedOTP._id });
    return true;
  }

  return false;
}

async function updatePassword(email, newPassword) {
  const db = await connectToDatabase();
  const collection = db.collection("users");

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await collection.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Password update error:", error);
    return false;
  }
}

module.exports = {
  sendOTP,
  login,
  register,
  verifyOTP,
  updatePassword,
  logout,
  verifyToken,
};
