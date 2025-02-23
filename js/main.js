window.addEventListener('load', () => {
  expenseAmount.focus();
  updateLanguage(currentLang);
});

document.addEventListener('DOMContentLoaded', () => {
  loadTransactions();
});
