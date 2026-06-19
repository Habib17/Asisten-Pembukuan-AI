function InputBox({
  input,
  setInput,
  kirimPesan,
}) {
  return (
    <div className="input-area">
 <input
  type="text"
  value={input}
  onChange={(e) =>
    setInput(e.target.value)
  }

  onKeyDown={(e) => {
    if (e.key === "Enter") {
      kirimPesan();
    }
  }}

  placeholder="Ketik transaksi..."
/>

      <button onClick={kirimPesan}>
        Kirim
      </button>
    </div>
  );
}

export default InputBox;