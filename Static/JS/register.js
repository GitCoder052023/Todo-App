const elements = {
    hamburger: document.getElementById("hamburger"),
    close: document.getElementById("close"),
    login: document.getElementById("Login"),
    loginButton: document.getElementById("LogSignButton"),
    signup: document.getElementById("Signup"),
    container: document.getElementById("Container"),
    signBtn: document.getElementById("Signbtn"),
    nameField: document.getElementById("nameField"),
    emailField: document.getElementById("EmailField"),
    passwordField: document.getElementById("PasswordField")
};

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

const openMenu = () => {
    elements.signup.style.marginRight = "56%";
    elements.login.style.minWidth = "50vw";
    elements.login.style.left = "50%";
    elements.login.style.zIndex = "5";
    elements.login.style.minHeight = "200vh";
};

const closeMenu = () => {
    elements.login.style.left = "-35%";
    elements.signup.style.marginRight = "56%";
};

const validateForm = () => {
    const fields = [elements.nameField, elements.emailField, elements.passwordField];
    const isEmpty = fields.some(field => field.value.trim() === '');

    if (isEmpty) {
        fields.forEach(field => {
            field.style.border = "1px solid red";
            field.classList.add("Red");
            field.placeholder = "Please fill out all the fields!";
        });
        return false;
    }
    return true;
};

const RegisterUser = async () => {
    const name = elements.nameField.value;
    const email = elements.emailField.value;
    const password = elements.passwordField.value;


    if (validateForm()) {
        try {
            const response = await fetch("/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                window.location.href = "http://localhost:8000/"
            } else {
                const errorData = await response.json();
                CustomAlert('Registeration failed, Try to login!', 'Registeration failed!', 'Got it');
                window.location.href = "http://localhost:8000/login"
            }
        }

        catch (error) {
            console.error('Error during login:', error);
        }
    }
}

elements.hamburger.addEventListener("click", openMenu);
elements.close.addEventListener("click", closeMenu);

elements.signBtn.addEventListener("click", () => {
    if (validateForm()) {
        setTimeout(() => {
            RegisterUser();
        }, 3000);
    }
});

elements.loginButton.addEventListener("click", () => {
    window.location.href = "http://localhost:8000/"
})