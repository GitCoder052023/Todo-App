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