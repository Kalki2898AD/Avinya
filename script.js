window.onload = function() {
    updateTime();
    setInterval(updateTime, 1000); // Update the time every second

    // Add event listeners for form submissions
    var registerForm = document.getElementById('register-form');
    var loginForm = document.getElementById('login-form');

    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }
};

function updateTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // JavaScript months are 0-based.
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var timeString = month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
    document.getElementById('date-time').innerHTML = timeString;
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "0px" || sidebar.style.width === "") {
        sidebar.style.width = "250px"; // Width of the sidebar when opened
    } else {
        sidebar.style.width = "0px";
    }
}

function registerUser(event) {
    event.preventDefault();

    var username = document.getElementById('register-username').value;
    var password = document.getElementById('register-password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(response => {
        if (response.status === 200) {
            alert('Registration successful');
            showLoginForm();
        } else {
            alert('Registration failed, please try again');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function loginUser(event) {
    event.preventDefault();

    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(response => {
        if (response.status === 200) {
            // Redirect to the home page
            window.location.href = 'home.html';
        } else {
            alert('Invalid username or password, please try again');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
