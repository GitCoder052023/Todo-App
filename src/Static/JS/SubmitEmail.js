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