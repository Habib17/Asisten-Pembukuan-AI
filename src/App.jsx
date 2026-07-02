import { useState, useEffect } from 'react';

import './App.css';

import ChatBox from './components/ChatBox';
import InputBox from './components/InputBox';
import TransactionList from './components/TransactionList';

function getWelcomeMessage() {
  const jam = new Date().getHours();

  let salam = '';
  let motivasi = '';

  if (jam >= 5 && jam < 11) {
    salam = '☀️ Selamat pagi!';
    motivasi = 'Semoga usaha Anda laris manis hari ini.';
  } else if (jam >= 11 && jam < 15) {
    salam = '🌤 Selamat siang!';
    motivasi = 'Semoga penjualan Anda terus meningkat.';
  } else if (jam >= 15 && jam < 18) {
    salam = '🌇 Selamat sore!';
    motivasi = 'Jangan lupa catat semua transaksi hari ini.';
  } else {
    salam = '🌙 Selamat malam!';
    motivasi = 'Saatnya mengecek laporan keuangan hari ini.';
  }

  return `${salam}

${motivasi}

Saya siap membantu Anda mencatat transaksi dan membuat laporan keuangan.

📝 Contoh:
• Jual kopi Rp25000
• Beli minyak Rp80000

📌 Perintah:
• laporan
• saldo
• riwayat
• bantuan

Silakan ketik transaksi pertama Anda 😊`;
}

function App() {
  const [input, setInput] = useState('');

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `👋 Selamat datang di Asisten Pembukuan AI!

Saya siap membantu Anda mencatat transaksi dan membuat laporan keuangan.

📝 Contoh:
• Jual kopi Rp25000
• Beli minyak Rp80000

📌 Perintah yang tersedia:
• laporan
• saldo
• riwayat
• bantuan

Silakan ketik transaksi pertama Anda 😊`,
    },
  ]);

  const [pendingAction, setPendingAction] = useState(null);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');

    return saved ? JSON.parse(saved) : [];
  });

  const analisaTransaksi = (text) => {
    const pesan = text.toLowerCase().trim();

    // ===========================
    // PERINTAH CHAT
    // ===========================

    switch (pesan) {
      case 'laporan':
        return {
          type: 'report',
          kategori: 'Laporan',
        };

      case 'saldo':
        return {
          type: 'saldo',
          kategori: 'Saldo',
        };

      case 'riwayat':
        return {
          type: 'history',
          kategori: 'Riwayat',
        };

      case 'hapus transaksi terakhir':
        return {
          type: 'delete_last',
          kategori: 'Delete',
        };

      case 'hapus semua transaksi':
        return {
          type: 'delete_all',
          kategori: 'Delete',
        };

      case 'bantuan':
        return {
          type: 'help',
          kategori: 'Bantuan',
          balasan: `🤖 Halo! Saya siap membantu pembukuan usaha Anda.

Saya bisa membantu Anda untuk:

📌 Mencatat transaksi
Contoh:
• Jual kopi Rp25000
• Beli minyak Rp80000

📊 Melihat laporan
• laporan

💰 Melihat saldo
• saldo

📋 Melihat riwayat
• riwayat

🗑 Menghapus transaksi
• hapus transaksi terakhir
• hapus semua transaksi

Silakan ketik transaksi Anda menggunakan bahasa yang sederhana.`,
        };
    }

    const nominal = ambilNominal(text);
    // ===========================
    // TRANSAKSI
    // ===========================

    if (pesan.includes('beli')) {
      return {
        type: 'expense',
        kategori: 'Bahan Baku',
        balasan: `✓ Pengeluaran dicatat

Kategori: Bahan Baku
Jumlah: Rp${nominal.toLocaleString('id-ID')}`,
      };
    }

    if (pesan.includes('jual')) {
      return {
        type: 'income',
        kategori: 'Penjualan',
        balasan: `✓ Penjualan dicatat

Kategori: Penjualan
Jumlah: Rp${nominal.toLocaleString('id-ID')}`,
      };
    }
    // ===========================
    // DEFAULT
    // ===========================
    return {
      type: 'unknown',
      kategori: '-',
      balasan: 'Maaf, saya belum memahami transaksi tersebut.',
    };
  };

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const hapusSemua = () => {
    localStorage.removeItem('transactions');

    setTransactions([]);
  };

  const kirimPesan = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput('');

    setTimeout(() => {
      const hasil = analisaTransaksi(userMessage.text);

      if (pendingAction === 'DELETE_ALL') {
        const jawaban = userMessage.text.toLowerCase();

        if (jawaban === 'ya') {
          setTransactions([]);

          localStorage.removeItem('transactions');

          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: '✅ Semua transaksi berhasil dihapus.',
            },
          ]);

          setPendingAction(null);

          return;
        }

        if (jawaban === 'tidak') {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: '👍 Penghapusan dibatalkan.',
            },
          ]);

          setPendingAction(null);

          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: "Ketik 'ya' atau 'tidak'.",
          },
        ]);

        return;
      }

      if (hasil.type === 'delete_all') {
        setPendingAction('DELETE_ALL');

        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `⚠️ Anda yakin ingin menghapus semua transaksi?

Ketik:

ya

atau

tidak`,
          },
        ]);

        return;
      }
      if (hasil.type === 'delete_last') {
        if (transactions.length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: 'Belum ada transaksi.',
            },
          ]);

          return;
        }

        const transaksiTerakhir = transactions[transactions.length - 1];

        setTransactions((prev) => prev.slice(0, -1));

        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `✅ Transaksi berhasil dihapus

${transaksiTerakhir.description}`,
          },
        ]);

        return;
      }

      if (hasil.type === 'history') {
        const lastTransactions = transactions.slice(-5).reverse();

        let laporanRiwayat = '📋 5 Transaksi Terakhir\n\n';

        if (lastTransactions.length === 0) {
          laporanRiwayat = 'Belum ada transaksi.';
        } else {
          lastTransactions.forEach((trx, index) => {
            laporanRiwayat += `${index + 1}. ${
              trx.type === 'income' ? '🟢' : '🔴'
            } ${trx.description}
(Rp${trx.amount.toLocaleString('id-ID')})\n`;
          });
        }

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: laporanRiwayat,
            },
          ]);
        }, 1000);

        return;
      }

      if (hasil.type === 'report') {
        const totalPenjualan = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalPengeluaran = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        const laba = totalPenjualan - totalPengeluaran;

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: `📊 Laporan Keuangan
────────────────────────

💰 Penjualan
Rp${totalPenjualan.toLocaleString('id-ID')}

💸 Pengeluaran
Rp${totalPengeluaran.toLocaleString('id-ID')}

📈 Laba
Rp${laba.toLocaleString('id-ID')}`,
            },
          ]);
        }, 1000);

        return;
      }
      if (hasil.type === 'saldo') {
        const totalPenjualan = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalPengeluaran = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        const saldo = totalPenjualan - totalPengeluaran;

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: `💰 Saldo Saat Ini

Rp${saldo.toLocaleString('id-ID')}`,
            },
          ]);
        }, 1000);

        return;
      }

      if (hasil.type === 'help') {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: hasil.balasan,
          },
        ]);

        return;
      }

      const nominal = ambilNominal(userMessage.text);

      if (hasil.type === 'income' || hasil.type === 'expense') {
        setTransactions((prev) => [
          ...prev,
          {
            type: hasil.type,
            kategori: hasil.kategori,
            amount: nominal,
            description: userMessage.text,
          },
        ]);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: hasil.balasan,
        },
      ]);
    }, 1000);
  };

  const ambilNominal = (text) => {
    const angka = text.match(/\d+/g);

    if (!angka) return 0;

    return parseInt(angka.join(''));
  };

  console.log(transactions);
  const totalPenjualan = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPengeluaran = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const laba = totalPenjualan - totalPengeluaran;

  return (
    <div className="container">
      <h1>Asisten Pembukuan AI</h1>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <div className="card">
          <h3>Penjualan</h3>
          <p>
            Rp
            {totalPenjualan.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card">
          <h3>Pengeluaran</h3>
          <p>
            Rp
            {totalPengeluaran.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="card">
          <h3>Laba</h3>
          <p>
            Rp
            {laba.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <button onClick={hapusSemua}>Hapus Semua Data</button>

      <TransactionList transactions={transactions} />
      <ChatBox messages={messages} />

      <InputBox input={input} setInput={setInput} kirimPesan={kirimPesan} />
    </div>
  );
}

export default App;
