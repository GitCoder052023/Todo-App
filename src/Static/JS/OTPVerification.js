const inputs = document.querySelectorAll('.otp-inputs input');
const verifyButton = document.querySelector('button');

inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1) {
            if (index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value) {
            if (index > 0) {
                inputs[index - 1].focus();
            }
        }
    });
});

function getOTP() {
    const otpInputs = document.querySelectorAll('.otp-box');
    let otp = '';

    otpInputs.forEach((input) => {
        otp += input.value;
    });

    return otp
}

verifyButton.addEventListener("click", async (e) => {
    const otp = getOTP()
    const email = localStorage.getItem('resetEmail');

    try {
        const response = await fetch('/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = "http://localhost:8000/reset-password"
        } else {
            CustomAlert(data.message, "Internal Server Error", 'Got it');
        }
    } catch (error) {
        console.error('Error:', error);
        CustomAlert('An error occurred. Please try again.', "Internal Server Error", 'Got it');
    }

})

