document.addEventListener('DOMContentLoaded', () => {
  renderNav('register');
  renderFooter();

  // Password strength meter
  document.getElementById('regPassword').addEventListener('input', updateStrength);

  // Final submit
  document.getElementById('regForm').addEventListener('submit', handleSubmit);
});

let currentStep = 1;

// ─── Step Navigation ───
function nextStep(from) {
  if (!validateStep(from)) return;
  goToStep(from + 1);
}

function prevStep(from) {
  goToStep(from - 1);
}

function goToStep(n) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');

  document.querySelectorAll('.step').forEach(s => {
    const num = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (num === n) s.classList.add('active');
    if (num < n) s.classList.add('done');
  });

  currentStep = n;
}

// ─── Per-Step Validation ───
function validateStep(step) {
  let valid = true;

  if (step === 1) {
    valid = checkRequired('fullName', /^.{3,}$/, 'Enter your full name (at least 3 characters).') && valid;
    valid = checkRequired('nationalId', /^\d{6,9}$/, 'Enter a valid 6–9 digit National ID.') && valid;
    valid = checkRequired('phone', /^\+?\d{9,15}$/, 'Enter a valid phone number.') && valid;

    const email = document.getElementById('email').value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email', 'Enter a valid email address.');
      valid = false;
    } else { setError('email', ''); }
  }

  if (step === 2) {
    valid = checkRequired('farmSize', /^[0-9]+(\.[0-9]+)?$/, 'Enter a valid farm size.') && valid;
    valid = checkRequired('titleDeed', /^.{4,}$/, 'Enter a valid title deed number.') && valid;

    if (!document.getElementById('county').value) {
      setError('county', 'Please select a county.');
      valid = false;
    } else { setError('county', ''); }

    if (!document.getElementById('farmType').value) {
      setError('farmType', 'Please select a farming type.');
      valid = false;
    } else { setError('farmType', ''); }
  }

  if (step === 3) {
    const pw = document.getElementById('regPassword').value;
    const cpw = document.getElementById('confirmPassword').value;

    if (!pw || pw.length < 8) {
      setError('regPassword', 'Password must be at least 8 characters.');
      valid = false;
    } else { setError('regPassword', ''); }

    if (pw !== cpw) {
      setError('confirmPassword', 'Passwords do not match.');
      valid = false;
    } else { setError('confirmPassword', ''); }

    if (!document.getElementById('terms').checked) {
      setError('terms', 'You must accept the Terms of Use.');
      valid = false;
    } else { setError('terms', ''); }
  }

  return valid;
}

// ─── Utility ───
function checkRequired(id, pattern, msg) {
  const input = document.getElementById(id);
  const val = input.value.trim();
  if (!val || !pattern.test(val)) {
    setError(id, msg);
    input.classList.add('input-error');
    return false;
  }
  setError(id, '');
  input.classList.remove('input-error');
  return true;
}

function setError(id, msg) {
  const el = document.getElementById('err-' + id);
  if (el) el.textContent = msg;
}

// ─── Password Strength ───
function updateStrength() {
  const pw = document.getElementById('regPassword').value;
  const meter = document.getElementById('pwdStrength');
  if (!pw) { meter.className = 'pwd-strength'; return; }

  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  meter.className = 'pwd-strength ' + (score <= 1 ? 'weak' : score === 2 ? 'fair' : 'strong');
}

// ─── Toggle Password ───
function toggleRegPwd(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  icon.className = isHidden ? 'fa fa-eye-slash' : 'fa fa-eye';
}

// ─── FINAL SUBMIT ───
function handleSubmit(e) {
  e.preventDefault();
  if (!validateStep(3)) return;

  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Registering…';
  btn.style.opacity = '.7';
  btn.style.pointerEvents = 'none';

  // ✅ IMPORTANT: Matches backend User entity
  const userData = {
    firstName: document.getElementById('fullName').value.trim(),
    emailAddress: document.getElementById('email').value.trim(),
    password: document.getElementById('regPassword').value,
    role: "FARMER"
  };

  // ✅ Correct backend endpoint
  fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
    .then(res => {
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    })
    .then(data => {
      console.log('Registered user:', data);
      alert('✅ Registration successful! Redirecting to login...');
      window.location.href = '../login/index.html';
    })
    .catch(err => {
      console.error(err);
      btn.innerHTML = 'Complete Registration';
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      alert('Registration failed. Please try again.');
    });
}