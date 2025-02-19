// Получаем элементы формы
const incomeDesc = document.getElementById('income-dsc');
const incomeAmount = document.getElementById('income-amt');
const expenseDesc = document.getElementById('expense-dsc');
const expenseAmount = document.getElementById('expense-amt');
const expenseCategory = document.getElementById('expense-cat');
const transactionsHistory = document.getElementById('transactions-history');
const totalExpenseElement = document.getElementById('total-expense');
const totalIncomeElement = document.getElementById('total-income');
const balanceElement = document.getElementById('balance');

// Adding an Income
function addIncome() {
  const description = incomeDesc.value.trim();
  const amount = parseFloat(incomeAmount.value.trim());

  if (description === '' || isNaN(amount) || amount <= 0) {
    alert(
      'Bitte geben Sie eine gültige Beschreibung und einen gültigen Betrag ein.'
    );
    return;
  }

  addTransaction(description, amount, 'Einnahmen', 'income');
  updateSummary();
  clearInputs('income');
}

// Adding an Expense
function addExpense() {
  const description = expenseDesc.value.trim();
  const amount = parseFloat(expenseAmount.value.trim());
  const category = expenseCategory.value;

  if (description === '' || isNaN(amount) || amount <= 0) {
    alert(
      'Bitte geben Sie eine gültige Benbeschreibung und einen gültigen Betrag ein.'
    );
    return;
  }

  addTransaction(description, amount, category, 'expense');
  updateSummary();
  clearInputs('expense');
}

// Add Transaction
function addTransaction(description, amount, category, type) {
  const transactionRow = document.createElement('tr');

  transactionRow.innerHTML = `
        <td>${description}</td>
        <td>${category}</td>
        <td>${amount.toFixed(2)}</td>
        <td>${type === 'income' ? 'Einnahmen' : 'Ausgaben'}</td>
        <td><button onclick="deleteTransaction(this)">Löschen</button></td>
    `;

  transactionsHistory.appendChild(transactionRow);
}

// Delete Transaction
function deleteTransaction(button) {
  const row = button.closest('tr');
  row.remove();
  updateSummary();
}

//  updateSummary
function updateSummary() {
  let totalExpenses = 0;
  let totalIncomes = 0;

  const transactions = transactionsHistory.querySelectorAll('tr');

  transactions.forEach(function (transaction) {
    const amount = parseFloat(transaction.children[2].textContent);
    const type = transaction.children[3].textContent;

    if (type === 'Einnahmen') {
      totalIncomes += amount;
    } else {
      totalExpenses += amount;
    }
  });

  totalExpenseElement.textContent = totalExpenses.toFixed(2);
  totalIncomeElement.textContent = totalIncomes.toFixed(2);
  balanceElement.textContent = (totalIncomes - totalExpenses).toFixed(2);
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

// Clear All Transactions
function clearAll() {
  transactionsHistory.innerHTML = '';
  updateSummary();
  clearInputs('income');
  clearInputs('expense');
}
