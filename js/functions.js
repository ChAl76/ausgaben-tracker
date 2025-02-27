// Adding an Income
function addIncome() {
  const description = incomeDesc.value.trim();
  const amount = parseFloat(incomeAmount.value.trim());

  if (!validateInput(description, amount)) return;

  addTransaction(
    description,
    amount,
    translations[currentLang].income,
    'income'
  );
  showNotification(translations[currentLang].add_income, 'success');
  updateSummary();
  saveTransactions();
  clearInputs('income');
}

// Adding an Expense
function addExpense() {
  const description = expenseDesc.value.trim();
  const amount = parseFloat(expenseAmount.value.trim());
  const category = expenseCategory.value;

  if (!validateInput(description, amount)) return;

  addTransaction(description, amount, category, 'expense');
  showNotification(translations[currentLang].add_expense, 'success');
  updateSummary();
  saveTransactions();
  clearInputs('expense');
}

// Validate Input
function validateInput(description, amount) {
  if (!description || description.length > 50) {
    showNotification(translations[currentLang].validation_desc, 'error');
    return false;
  }
  if (isNaN(amount) || amount <= 0 || amount > 1000000) {
    showNotification(translations[currentLang].validation_amount, 'error');
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
        ${formattedAmount.toFixed(2)} ${currentCurrency}
      </td>
      <td>${
        type === 'income'
          ? translations[currentLang].income
          : translations[currentLang].expense
      }</td>
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

// Update Summary
function updateSummary() {
  let totalExpenses = 0;
  let totalIncomes = 0;

  const transactions = transactionsHistory.querySelectorAll('tr');
  transactions.forEach((transaction) => {
    const amountCell = transaction.querySelector('td:nth-child(3)');
    const amountText = amountCell.textContent
      .replace(currentCurrency, '')
      .trim();
    const amount = parseFloat(amountText);
    if (amount > 0) totalIncomes += amount;
    else totalExpenses += Math.abs(amount);
  });

  totalIncomeElement.textContent = `${totalIncomes.toFixed(
    2
  )} ${currentCurrency}`;
  totalIncomeElement.classList.remove('negative', 'positive');
  totalIncomeElement.classList.add('positive');

  totalExpenseElement.textContent =
    totalExpenses === 0
      ? `0.00 ${currentCurrency}`
      : `-${totalExpenses.toFixed(2)} ${currentCurrency}`;
  totalExpenseElement.classList.remove('negative', 'positive');
  totalExpenseElement.classList.add(
    totalExpenses === 0 ? 'positive' : 'negative'
  );

  const currentBalance = totalIncomes - totalExpenses;
  balanceElement.textContent = `${currentBalance.toFixed(
    2
  )} ${currentCurrency}`;
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

// Save Transactions
function saveTransactions() {
  const transactions = Array.from(transactionsHistory.children).map((row) => {
    const amountText = row.cells[2].textContent
      .replace(currentCurrency, '')
      .trim();
    return {
      description: row.cells[0].textContent,
      category: row.cells[1].textContent,
      amount: parseFloat(amountText),
      type:
        row.cells[3].textContent === translations[currentLang].income
          ? 'income'
          : 'expense',
    };
  });
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load Transactions
function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  transactions.forEach((t) => {
    const amount = Math.abs(t.amount);
    addTransaction(t.description, amount, t.category, t.type);
  });
  updateSummary();
}

// Clear All
function clearAll() {
  transactionsHistory.innerHTML = '';
  updateSummary();
  saveTransactions();
  clearInputs('income');
  clearInputs('expense');
}
