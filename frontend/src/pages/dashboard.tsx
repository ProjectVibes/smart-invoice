import { useEffect, useState } from "react";
import API from "../utils/axios";
import type { Invoice } from "../types/types";
import InvoiceForm from "../components/invoiceForm";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [email, setEmail] = useState("");
  const [sendStatus, setSendStatus] = useState("");
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    const res = await API.get("/invoice");
    setInvoices(res.data);
  };

  const handleDownload = async (id: string) => {
    const res = await API.get(`/invoice/${id}/pdf`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${id}.pdf`;
    link.click();
  };

  const handleSend = async (id: string) => {
    setSendStatus("Sending...");
    try {
      await API.post(`/invoice/${id}/send`, { toEmail: email });
      setSendStatus("Sent!");
    } catch {
      setSendStatus("Failed to send");
    }
  };

  const handleLogout = async () => {
    await API.post("/auth/logout");
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button onClick={handleLogout} className="text-sm text-red-600">
          Logout
        </button>
      </div>

      <InvoiceForm onSuccess={fetchInvoices} />

      <h3 className="text-xl font-semibold mt-8 mb-2">Invoices</h3>
      {invoices.map((inv) => (
        <div
          key={inv.id}
          className="border p-3 mb-3 rounded flex justify-between items-center bg-white"
        >
          <div>
            <p className="font-semibold">{inv.customer}</p>
            <p className="text-sm">${inv.total} • {inv.is_paid} • Due {new Date(inv.due_date).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => handleDownload(inv.id)}
              className="text-blue-600 text-sm underline"
            >
              Download PDF
            </button>
            <input
              placeholder="client@email.com"
              onChange={(e) => setEmail(e.target.value)}
              className="border px-2 py-1 text-sm"
            />
            <button
              onClick={() => handleSend(inv.id)}
              className="bg-green-600 text-white text-sm px-2 py-1 rounded"
            >
              Send
            </button>
          </div>
        </div>
      ))}

      {sendStatus && <p className="text-sm mt-4">{sendStatus}</p>}
    </div>
  );
}
