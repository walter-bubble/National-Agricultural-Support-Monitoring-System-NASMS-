document.addEventListener('DOMContentLoaded', () => {
  renderNav('loans');
  renderFooter();
  loadFarmerLoans();
});

let activeLoanName = '';

// Open & close modal
function openApplyModal(name) {
  activeLoanName = name;
  document.getElementById('modalTitle').textContent = 'Apply: ' + name;
  document.getElementById('applyModal').classList.add('open');
}

function closeApplyModal() {
  document.getElementById('applyModal').classList.remove('open');
}

// Submit new loan
function submitLoan() {
  const amount = Number(document.getElementById('loanAmount').value);
  const purpose = document.getElementById('loanPurpose').value.trim();
  const farmerId = localStorage.getItem('farmerId');

  if (!amount || amount < 1000) {
    alert('Enter a valid loan amount (min KES 1,000).');
    return;
  }
  if (!purpose) {
    alert('Enter the purpose of the loan.');
    return;
  }

  const loanData = {
    loanName: activeLoanName,
    amount: amount,
    purpose: purpose
  };

  fetch(`http://localhost:8080/api/loans/farmer/${farmerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loanData)
  })
    .then(res => {
      if (!res.ok) throw new Error('Loan request failed');
      return res.json();
    })
    .then(data => {
      alert(`✅ Your application for "${activeLoanName}" (KES ${amount.toLocaleString()}) has been submitted.`);
      document.getElementById('loanAmount').value = '';
      document.getElementById('loanPurpose').value = '';
      closeApplyModal();
      loadFarmerLoans(); // refresh table
    })
    .catch(err => {
      console.error(err);
      alert('Error submitting loan.');
    });
}

// Load loans for the logged-in farmer
function loadFarmerLoans() {
  const farmerId = localStorage.getItem('farmerId');
  fetch(`http://localhost:8080/api/loans/farmer/${farmerId}`)
    .then(res => res.json())
    .then(loans => {
      const tbody = document.querySelector('.dash-panel table tbody');
      tbody.innerHTML = '';

      loans.forEach(loan => {
        tbody.innerHTML += `
          <tr>
            <td>${loan.loanName}</td>
            <td><strong>${loan.amount ? 'KES ' + loan.amount.toLocaleString() : '-'}</strong></td>
            <td>${loan.appliedDate ? new Date(loan.appliedDate).toLocaleDateString() : '-'}</td>
            <td><span class="badge ${loan.status === 'Open' ? 'badge-green' : loan.status === 'Under Review' ? 'badge-yellow' : 'badge-red'}">${loan.status}</span></td>
            <td>${loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : '-'}</td>
          </tr>
        `;
      });
    })
    .catch(err => console.error(err));
}

// Close modal on overlay click
document.getElementById('applyModal').addEventListener('click', function(e) {
  if (e.target === this) closeApplyModal();
});