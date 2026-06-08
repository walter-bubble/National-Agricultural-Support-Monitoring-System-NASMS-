document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

function handleLogin(e) {
  e.preventDefault();

  const emailAddress = document.getElementById('userName').value.trim(); // renamed logically
  const password = document.getElementById('password').value;

  fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailAddress, password })
  })
    .then(async res => {
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Login failed');
      }
      return res.text(); // ✅ backend returns token (String)
    })
    .then(token => {
      // Save token
      localStorage.setItem('token', token);

      // Optional: store email
      localStorage.setItem('emailAddress', emailAddress);

      // Redirect
      window.location.href = '../loans/index.html';
    })
    .catch(err => {
      console.error(err);
      alert('Login failed: ' + err.message);
    });
}