import { useState, useEffect } from "react";

import "./App.css";

import ChatBox from "./components/ChatBox";
import InputBox from "./components/InputBox";
import TransactionList from "./components/TransactionList";


function App() {

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);

const [transactions, setTransactions] = useState(() => {

  const saved =
    localStorage.getItem("transactions");

  return saved
    ? JSON.parse(saved)
    : [];
});

    const analisaTransaksi = (text) => {

  const pesan = text.toLowerCase();
  const nominal =
  ambilNominal(text);

  if (pesan.includes("beli")) {

    return {
      type: "expense",
      kategori: "Bahan Baku",
balasan:
`✓ Pengeluaran dicatat

Kategori: Bahan Baku
Jumlah: Rp${nominal.toLocaleString("id-ID")}`
    };
  }

  if (pesan.includes("jual")) {

    return {
      type: "income",
      kategori: "Penjualan",
      balasan:
        `✓ Penjualan dicatat

Kategori: Penjualan
Jumlah: Rp${nominal.toLocaleString("id-ID")}`
    };
  }

  return {
    type: "unknown",
    kategori: "-",
    balasan:
      "Maaf, saya belum memahami transaksi tersebut."
  };
};

useEffect(() => {

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );

}, [transactions]);

const hapusSemua = () => {

  localStorage.removeItem(
    "transactions"
  );

  setTransactions([]);
};


  const kirimPesan = () => {

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages(prev => [
      ...prev,
      userMessage,
    ]);

    setInput("");

    setTimeout(() => {

const hasil =
  analisaTransaksi(userMessage.text);
const nominal =
  ambilNominal(userMessage.text);

setTransactions(prev => [
  ...prev,
  {
    type: hasil.type,
    kategori: hasil.kategori,
    amount: nominal,
    description: userMessage.text,
  }
]);

setMessages(prev => [
  ...prev,
  {
    sender: "bot",
    text: hasil.balasan,
  },
]);

    }, 1000);
  };



  const ambilNominal = (text) => {

  const angka = text.match(/\d+/g);

  if (!angka) return 0;

  return parseInt(
    angka.join("")
  );
};


console.log(transactions);
const totalPenjualan = transactions
  .filter(t => t.type === "income")
  .reduce((sum, t) => sum + t.amount, 0);

const totalPengeluaran = transactions
  .filter(t => t.type === "expense")
  .reduce((sum, t) => sum + t.amount, 0);

const laba =
  totalPenjualan - totalPengeluaran;


  return (
    <div className="container">
      <h1>Asisten Pembukuan AI</h1>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  }}
>
  <div className="card">
    <h3>Penjualan</h3>
    <p>
      Rp
      {totalPenjualan.toLocaleString(
        "id-ID"
      )}
    </p>
  </div>

  <div className="card">
    <h3>Pengeluaran</h3>
    <p>
      Rp
      {totalPengeluaran.toLocaleString(
        "id-ID"
      )}
    </p>
  </div>

  <div className="card">
    <h3>Laba</h3>
    <p>
      Rp
      {laba.toLocaleString(
        "id-ID"
      )}
    </p>
  </div>
</div>

  <button onClick={hapusSemua}>
      Hapus Semua Data
    </button>
    
<TransactionList
  transactions={transactions}
/>
      <ChatBox
        messages={messages}
      />

      <InputBox
        input={input}
        setInput={setInput}
        kirimPesan={kirimPesan}
      />
    </div>
  );
}

export default App;