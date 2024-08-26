const form = document.getElementById('resetForm');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const message = document.getElementById('message');
const strengthMeter = document.querySelector('.password-strength-meter');
const email = localStorage.getItem('resetEmail');

password.addEventListener('input', updateStrengthMeter);

function updateStrengthMeter() {
    const result = zxcvbn(password.value);
    const strength = (result.score + 1) * 25;
    strengthMeter.style.width = `${strength}%`;

    if (strength <= 25) {
        strengthMeter.style.backgroundColor = '#ff4d4d';
    } else if (strength <= 50) {
        strengthMeter.style.backgroundColor = '#ffa500';
    } else if (strength <= 75) {
        strengthMeter.style.backgroundColor = '#ffff00';
    } else {
        strengthMeter.style.backgroundColor = '#00cc00';
    }
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (password.value !== confirmPassword.value) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    if (zxcvbn(password.value).score < 3) {
        showMessage('Please choose a stronger password', 'error');
        return;
    }


    fetch('/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, newPassword: confirmPassword.value }),
    })
        .then(response => response.json())
        .then(data => {
            showMessage(message.data, "success");
            if (data.message === "Password updated successfully") {
                window.location.href = "http://localhost:8000/"
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage("An error occured, please try again!", "error")
        });

    form.reset();
    strengthMeter.style.width = '0';
});

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}