const translations = {
  de: {
    title: 'Ausgaben Tracker',
    income_title: 'Einnahmen',
    expense_title: 'Ausgaben',
    description: 'Beschreibung',
    amount: 'Betrag (€)',
    category: 'Kategorie',
    add_income: 'Einnahmen Hinzufügen',
    add_expense: 'Ausgaben Hinzufügen',
    transactions_title: 'Transaktionsverlauf',
    type: 'Typ',
    action: 'Aktion',
    summary_title: 'Zusammenfassung',
    total_income: 'Gesamte Einnahmen:',
    total_expense: 'Gesamte Ausgaben:',
    balance: 'Kontostand:',
    clear_all: 'Alles Löschen',
    cat_house: 'Haus',
    cat_food: 'Lebensmittel',
    cat_health: 'Gesundheit',
    cat_car: 'Auto',
    cat_leisure: 'Freizeit',
    cat_other: 'Sonstiges',
    income: 'Einnahmen',
    expense: 'Ausgaben',
    currency: '€',
    validation_desc: 'Beschreibung muss zwischen 1 und 50 Zeichen sein.',
    validation_amount: 'Betrag muss zwischen 1 und 1.000.000€ sein.',
    currency: '€',
  },
  ua: {
    title: 'Трекер Витрат',
    income_title: 'Доходи',
    expense_title: 'Витрати',
    description: 'Опис',
    amount: 'Сума (₴)',
    category: 'Категорія',
    add_income: 'Додати Доходи',
    add_expense: 'Додати Витрати',
    transactions_title: 'Історія Транзакцій',
    type: 'Тип',
    action: 'Дія',
    summary_title: 'Підсумок',
    total_income: 'Загальні Доходи:',
    total_expense: 'Загальні Витрати:',
    balance: 'Баланс:',
    clear_all: 'Очистити Все',
    cat_house: 'Дім',
    cat_food: 'Продукти',
    cat_health: 'Здоров’я',
    cat_car: 'Авто',
    cat_leisure: 'Дозвілля',
    cat_other: 'Інше',
    income: 'Доходи',
    expense: 'Витрати',
    currency: '₴',
    validation_desc: 'Опис має бути від 1 до 50 символів.',
    validation_amount: 'Сума має бути від 1 до 1.000.000₴.',
    currency: '₴',
  },
  en: {
    title: 'Expense Tracker',
    income_title: 'Income',
    expense_title: 'Expenses',
    description: 'Description',
    amount: 'Amount ($)',
    category: 'Category',
    add_income: 'Add Income',
    add_expense: 'Add Expense',
    transactions_title: 'Transaction History',
    type: 'Type',
    action: 'Action',
    summary_title: 'Summary',
    total_income: 'Total Income:',
    total_expense: 'Total Expenses:',
    balance: 'Balance:',
    clear_all: 'Clear All',
    cat_house: 'Housing',
    cat_food: 'Food',
    cat_health: 'Health',
    cat_car: 'Car',
    cat_leisure: 'Leisure',
    cat_other: 'Other',
    income: 'Income',
    expense: 'Expenses',
    currency: '$',
    validation_desc: 'Description must be between 1 and 50 characters.',
    validation_amount: 'Amount must be between 1 and 1,000,000$.',
    currency: '$',
  },
};

let currentLang = localStorage.getItem('language') || 'de';
let currentCurrency = translations[currentLang].currency;

function updateLanguage(lang) {
  currentLang = lang;
  currentCurrency = translations[lang].currency;
  localStorage.setItem('language', lang);
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    element.textContent = translations[lang][key];
  });

  updateTransactionsCurrency();
  updateSummary();
}

function updateTransactionsCurrency() {
  const transactions = transactionsHistory.querySelectorAll('tr');

  transactions.forEach((row) => {
    const amountCell = row.querySelector('td:nth-child(3)');
    const amountText = amountCell.textContent.replace(/[^\d.-]/g, '');
    const amount = parseFloat(amountText);
    amountCell.textContent = `${amount < 0 ? '-' : ''}${Math.abs(
      amount
    ).toFixed(2)} ${currentCurrency}`;
  });
  document.querySelector('th[data-i18n="amount"]').textContent = `${
    translations[currentLang].amount.split(' ')[0]
  } (${currentCurrency})`;
}

languageSelect.value = currentLang;
languageSelect.addEventListener('change', (e) => {
  updateLanguage(e.target.value);
});
