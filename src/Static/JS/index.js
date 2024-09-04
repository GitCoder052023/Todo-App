document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("logButton");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  async function attemptAutoLogin() {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch("/verify-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.isValid) {
            window.location.href = "http://localhost:8000/home";
          } else {
            handleInvalidSession("Invalid token. Please log in again.");
          }
        } else if (response.status === 401) {
          handleInvalidSession(
            "Session expired or invalid. Please log in again."
          );
        } else {
          console.error("Unexpected response status:", response.status);
          handleInvalidSession(
            "An error occurred. Please try logging in again."
          );
        }
      } catch (error) {
        console.error("Error during token verification:", error);
        alert("Temporary issue. Please try again later.");
      }
    } else {
      console.log("No token found, continuing with manual login.");
    }
  }

  function handleInvalidSession(message) {
    CustomAlert(message, "Authentication Required", "Got it");
    localStorage.removeItem("token");
  }

  attemptAutoLogin();

  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;

    if (
      emailValue !== "" &&
      passwordValue !== "" &&
      emailValue.includes("@") &&
      emailValue.endsWith(".com")
    ) {
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailValue, password: passwordValue }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "http://localhost:8000/home";
        } else {
          const errorData = await response.json();
          CustomAlert(
            "Login failed, Please Try to Register!",
            "Login failed!",
            "Got it"
          );
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    } else {
      emailInput.classList.add("Red");
      emailInput.placeholder = "Invalid email!";
      passwordInput.classList.add("Red");
      passwordInput.placeholder = "Invalid password!";
    }
  });
});
