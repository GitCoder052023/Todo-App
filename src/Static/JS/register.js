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