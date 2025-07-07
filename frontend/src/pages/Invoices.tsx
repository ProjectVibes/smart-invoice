import { useState } from 'react'
import axios from 'axios'

const Invoices = () => {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await axios.post('http://localhost:3001/invoice', {
      title,
      amount: parseFloat(amount),
      dueDate,
      userId: 'demo-user-id' // replace with actual logged-in user ID
    })
    alert('Invoice created!')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border p-2 rounded" />
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  )
}

export default Invoices
