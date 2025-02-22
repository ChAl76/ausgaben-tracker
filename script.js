// Получаем элементы формы
const incomeDesc = document.getElementById('income-dsc');
const incomeAmount = document.getElementById('income-amt');
const expenseDesc = document.getElementById('expense-dsc');
const expenseAmount = document.getElementById('expense-amt');
const expenseCategory = document.getElementById('expense-cat');
const transactionsHistory = document.getElementById('transactions-history');
const notification = document.getElementById('notification');
const totalExpenseElement = document.getElementById('total-expense');
const totalIncomeElement = document.getElementById('total-income');
const balanceElement = document.getElementById('balance');

window.addEventListener('load', function () {
  expenseAmount.focus();
});

// Adding an Income
function addIncome() {
  const description = incomeDesc.value.trim();
  const amount = parseFloat(incomeAmount.value.trim());

  if (!validateInput(description, amount)) return;

  addTransaction(description, amount, 'Einnahmen', 'income');
  showNotification('Transaktion hinzugefügt');
  updateSummary();
  saveTransactions();
  clearInputs('income');
}

// Adding an Expense
function addExpense() {
  const description = expenseDesc.value.trim();
  const amount = parseFloat(expenseAmount.value.trim());
  const category = expenseCategory.value;

  if (!validateInput(description, amount)) {
    return;
  }

  addTransaction(description, amount, category, 'expense');
  showNotification('Transaktion hinzugefügt');
  saveTransactions();
  updateSummary();
  clearInputs('expense');
}

// validate input
function validateInput(description, amount) {
  if (!description || description.length > 50) {
    showNotification(
      'Beschreibung muss zwischen 1 und 50 Zeichen sein.',
      'error'
    );
    return false;
  }

  if (isNaN(amount) || amount <= 0 || amount > 1000000) {
    showNotification('Betrag muss zwischen 1 und 1.000.000€ sein.', 'error');
    return false;
  }

  return true;
}

// Add Transaction
function addTransaction(description, amount, category, type) {
  const transactionRow = document.createElement('tr');
  const formattedAmount = type === 'expense' ? -amount : amount;

  transactionRow.innerHTML = `
        <td>${description}</td>
        <td>${category}</td>
        <td class="${type === 'expense' ? 'expense-amt' : 'income-amt'}">
            ${formattedAmount.toFixed(2)}
        </td>
        <td>${type === 'income' ? 'Einnahmen' : 'Ausgaben'}</td>
        <td><button class="delete-button" onclick="deleteTransaction(this)"><i class="fas fa-trash"></i></button></td>
    `;

  transactionRow.classList.add('transaction-row');
  transactionsHistory.appendChild(transactionRow);
}

// Show Notification
function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.classList.remove('hidden');
  notification.style.backgroundColor = type === 'error' ? '#da1111' : '#0ac20a';

  setTimeout(() => notification.classList.add('hidden'), 2500);
}

// Delete Transaction
function deleteTransaction(button) {
  const row = button.closest('tr');
  row.remove();
  updateSummary();
  saveTransactions();
}

//  updateSummary
function updateSummary() {
  let totalExpenses = 0;
  let totalIncomes = 0;

  const transactions = transactionsHistory.querySelectorAll('tr');

  transactions.forEach(function (transaction) {
    const amountCell = transaction.querySelector('td:nth-child(3)');
    const amount = parseFloat(amountCell.textContent);

    if (amount > 0) {
      totalIncomes += amount;
    } else {
      totalExpenses += Math.abs(amount);
    }
  });

  totalIncomeElement.textContent = totalIncomes.toFixed(2);
  totalIncomeElement.classList.remove('negative', 'positive');
  totalIncomeElement.classList.add('positive');

  totalExpenseElement.textContent =
    totalExpenses === 0 ? '0.00' : `-${totalExpenses.toFixed(2)}`;
  totalExpenseElement.classList.remove('negative', 'positive');
  totalExpenseElement.classList.add(
    totalExpenses === 0 ? 'positive' : 'negative'
  );

  const currentBalance = totalIncomes - totalExpenses;
  balanceElement.textContent = currentBalance.toFixed(2);
  balanceElement.classList.remove('negative', 'positive');
  balanceElement.classList.add(currentBalance >= 0 ? 'positive' : 'negative');
}

// Clear Inputs
function clearInputs(type) {
  if (type === 'income') {
    incomeDesc.value = '';
    incomeAmount.value = '';
  } else {
    expenseDesc.value = '';
    expenseAmount.value = '';
    expenseCategory.value = 'Haus';
  }
}

// Save All Transactions
function saveTransactions() {
  const transactions = Array.from(transactionsHistory.children).map((row) => ({
    description: row.cells[0].textContent,
    category: row.cells[1].textContent,
    amount: parseFloat(row.cells[2].textContent),
    type: row.cells[3].textContent === 'Einnahmen' ? 'income' : 'expense',
  }));
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load transactions from localStorage
function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  transactions.forEach((t) => {
    const amount = Math.abs(t.amount);
    addTransaction(t.description, amount, t.category, t.type);
  });
  updateSummary();
}

// Clear All Transactions
function clearAll() {
  transactionsHistory.innerHTML = '';
  updateSummary();
  saveTransactions();
  clearInputs('income');
  clearInputs('expense');
}

document.addEventListener('DOMContentLoaded', loadTransactions);
