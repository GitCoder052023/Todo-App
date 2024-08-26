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

document.getElementById('resetPasswordForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.querySelector('input[type="email"]').value;
    localStorage.setItem('resetEmail', email);

    if (email !== "" && email.includes("@") && email.includes(".com")) {
        fetch('/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        })
            .then(response => {
                response.json()
                window.location.href = "http://localhost:8000/OTP";
            })
            .catch((error) => {
                console.error('Error:', error);
                CustomAlert('An error occurred. Please try again.', "Internal server error!", 'Got it');
            });
    }

    else {
        CustomAlert("Inavalid email format, Try again!", "Invalid email format", 'Got it')
    }
});