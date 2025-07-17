import { useState } from "react";
import API from "../utils/axios";

interface Props {
  onSuccess: () => void;
}

export default function InvoiceForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    customer: "",
    total: "",
    due_date: "",
    is_paid: "unpaid",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.post("/invoice", {
      ...form,
      total: parseFloat(form.total),
    });
    setForm({ customer: "", total: "", due_date: "", is_paid: "unpaid" });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-100 p-4 rounded">
      <input
        name="customer"
        placeholder="Client Name"
        value={form.customer}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        name="total"
        type="number"
        placeholder="Amount"
        value={form.total}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        name="due_date"
        type="date"
        value={form.due_date}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <select
        name="is_paid"
        value={form.is_paid}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="unpaid">Unpaid</option>
        <option value="paid">Paid</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Invoice
      </button>
    </form>
  );
}
