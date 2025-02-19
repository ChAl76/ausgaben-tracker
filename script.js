const expenseForm = document.getElementById('#expense-form');
const expenseInput = document.getElementById('#expense-input');
const amountInput = document.getElementById('#amount-input');
const categoryInput = document.getElementById('#category-input');
const transactionList = document.getElementById('#transaction-list');
const totalExpense = document.getElementById('#total-expense');
const totalIncome = document.getElementById('#total-income');
const balance = document.getElementById('#balance');

// Adding an Expense
expenseForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const description = expenseInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const category = categoryInput.value;

  if (description === '' || isNaN(amount) || amount <= 0) {
    alert(
      'Bitte geben Sie eine gültige Ausgabenbeschreibung und einen gültigen Betrag ein.'
    );
    return;
  }

  addTransaction(description, amount, category);
  updateSummary();
  clearInputs();
});

function addTransaction(description, amount, category) {
  const transactionRow = document.createElement('tr');

  transactionRow.innerHTML = `
    <td>${description}</td>
    <td>${category}</td>
    <td>${amount.toFixed(2)}</td>
    <td><button class="delete-btn">Löschen</button></td>
  `;

  transactionList.appendChild(transactionRow);

  transactionRow
    .querySelector('.delete-btn')
    .addEventListener('click', function () {
      transactionRow.remove();
      updateSummary();
    });
}

// Updating the Summary
function updateSummary() {
  let totalExpenses = 0;
  let totalIncomes = 0;

  const transactions = transactionList.querySelectorAll('tr');

  transactions.forEach(function (transaction) {
    const amount = parseFloat(transaction.children[2].textContent);
    const category = transaction.children[1].textContent;

    if (category === 'Einnahmen') {
      totalIncomes += amount;
    } else {
      totalExpenses += amount;
    }
  });

  totalExpense.textContent = totalExpenses.toFixed(2);
  totalIncome.textContent = totalIncomes.toFixed(2);
  balance.textContent = (totalIncomes - totalExpenses).toFixed(2);
}
