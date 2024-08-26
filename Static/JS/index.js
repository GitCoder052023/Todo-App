function CustomAlert(message, title = 'Alert', buttonText = 'OK') {
    // Create styles
    const styles = `
.modern-alert-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}
.modern-alert-dialog {
background-color: white;
border-radius: 8px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
padding: 20px;
max-width: 400px;
width: 90%;
}
.modern-alert-title {
font-size: 1.5em;
font-weight: bold;
margin-bottom: 10px;
}
.modern-alert-message {
margin-bottom: 20px;
}
.modern-alert-button {
background-color: #007bff;
border: none;
color: white;
padding: 10px 20px;
border-radius: 4px;
cursor: pointer;
font-size: 1em;
}
.modern-alert-button:hover {
background-color: #0056b3;
}
`;

    // Create HTML
    const html = `
<div class="modern-alert-overlay">
<div class="modern-alert-dialog">
<div class="modern-alert-title">${title}</div>
<div class="modern-alert-message">${message}</div>
<button class="modern-alert-button">${buttonText}</button>
</div>
</div>
`;

    // Create and append style element
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Create and append alert element
    const alertElement = document.createElement('div');
    alertElement.innerHTML = html;
    document.body.appendChild(alertElement);

    // Add event listener to close the alert
    const closeAlert = () => {
        document.body.removeChild(alertElement);
        document.head.removeChild(styleElement);
    };

    alertElement.querySelector('.modern-alert-button').addEventListener('click', closeAlert);
    alertElement.querySelector('.modern-alert-overlay').addEventListener('click', (e) => {
        if (e.target === alertElement.querySelector('.modern-alert-overlay')) {
            closeAlert();
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('logButton');
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const emailValue = emailInput.value;
        const passwordValue = passwordInput.value;

        if (emailValue !== "" && passwordValue !== "" && emailValue.includes("@") && emailValue.endsWith(".com")) {
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: emailValue, password: passwordValue }),
                });

                if (response.ok) {
                    window.location.href = "http://localhost:8000/home";
                } else {
                    const errorData = await response.json();
                    CustomAlert('Login failed, Please Try to Register!', 'Login failed!', 'Got it');
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        } else {
            emailInput.classList.add("Red");
            emailInput.placeholder = "Invalid email!";
            passwordInput.classList.add("Red");
            passwordInput.placeholder = "Invalid password!";
        }
    });
});