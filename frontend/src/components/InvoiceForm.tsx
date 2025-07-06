import { useState } from "react";
import axios from "axios";

export default function App() {
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async () => {
    const items = [{ description: itemDesc, price }];
    const total = items.reduce((sum, i) => sum + i.price, 0);
    await axios.post("http://localhost:3001/invoice", {
      customer, email, items, total, dueDate,
    });
    alert("Invoice Sent!");
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Smart Invoice</h1>
      <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Customer" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={itemDesc} onChange={e => setItemDesc(e.target.value)} placeholder="Item Description" />
      <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price" />
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      <button onClick={handleSubmit}>Send Invoice</button>
    </div>
  );
}
