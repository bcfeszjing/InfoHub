document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');

    if (username === storedUsername) {
        alert('Username already exists. Please choose a different username.');
    } else if (email === storedEmail) {
        alert('Email already exists. Please choose a different email.');
    } else if (username && email && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);

        alert('Sign up successful!');
        window.location.href = 'login.html';
    } else {
        alert('Please fill out all fields.');
    }
});

