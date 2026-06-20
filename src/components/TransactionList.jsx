function TransactionList({ transactions }) {
  return (
    <div className="transaction-list">
      <h2>Daftar Transaksi</h2>

      {transactions.length === 0 ? (
        <p>Belum ada transaksi</p>
      ) : (
        transactions.map((trx, index) => (
          <div key={index} className="transaction-item">
            <div>
              <strong>
                {trx.type === 'income' ? '🟢 Penjualan' : '🔴 Pengeluaran'}
              </strong>
            </div>

            <div>{trx.description}</div>

            <div>
              Rp
              {trx.amount.toLocaleString('id-ID')}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TransactionList;
