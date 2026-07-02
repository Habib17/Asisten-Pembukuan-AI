export function loadTransactions() {
  const saved = localStorage.getItem("transactions");

  return saved ? JSON.parse(saved) : [];
}

export function saveTransactions(transactions) {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}