import { useState } from "react";
import "./App.css";

function App() {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    function addExpense(event) {
        event.preventDefault();

        if (!title.trim() || Number(amount) <= 0 || !date) {
            alert("Please enter valid expense details.");
            return;
        }

        const newExpense = {
            id: Date.now(),
            title: title.trim(),
            amount: Number(amount),
            category,
            date
        };

        setExpenses((previous) => [...previous, newExpense]);

        setTitle("");
        setAmount("");
        setCategory("Food");
        setDate(new Date().toISOString().split("T")[0]);
    }

    function deleteExpense(id) {
        setExpenses((previous) =>
            previous.filter((expense) => expense.id !== id)
        );
    }

    const totalExpense = expenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    return (
        <div className="app">
            <header className="header">
                <h1>Personal Expense Tracker</h1>
                <p>Manage your daily expenses easily</p>
            </header>

            <main className="container">
                <section className="summary">
                    <h2>Total Expenses</h2>
                    <p>₹{totalExpense.toFixed(2)}</p>
                    <span>{expenses.length} expense(s) recorded</span>
                </section>

                <section className="card">
                    <h2>Add New Expense</h2>

                    <form onSubmit={addExpense}>
                        <label htmlFor="title">Expense Name</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. Lunch"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />

                        <label htmlFor="amount">Amount (₹)</label>
                        <input
                            id="amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            required
                        />

                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                        >
                            <option>Food</option>
                            <option>Travel</option>
                            <option>Shopping</option>
                            <option>Education</option>
                            <option>Bills</option>
                            <option>Other</option>
                        </select>

                        <label htmlFor="date">Date</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            required
                        />

                        <button type="submit">Add Expense</button>
                    </form>
                </section>

                <section className="card">
                    <h2>Expense History</h2>

                    {expenses.length === 0 ? (
                        <p className="empty">
                            No expenses added yet. Add your first expense!
                        </p>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {expenses.map((expense) => (
                                        <tr key={expense.id}>
                                            <td>{expense.title}</td>
                                            <td>{expense.category}</td>
                                            <td>{expense.date}</td>
                                            <td>₹{expense.amount.toFixed(2)}</td>
                                            <td>
                                                <button
                                                    className="delete-btn"
                                                    type="button"
                                                    onClick={() =>
                                                        deleteExpense(expense.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

            <footer>
                <p>Personal Expense Tracker | React Application</p>
            </footer>
        </div>
    );
}

export default App;
