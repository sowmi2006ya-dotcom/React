import { useState, useEffect, useMemo } from "react";
import "./App.css";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(true);

  const budget = 10000;

  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!title || !amount) return;

    const newExpense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      category,
      date: new Date().toLocaleDateString(),
    };

    setExpenses([...expenses, newExpense]);
    setTitle("");
    setAmount("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  const filteredExpenses = expenses.filter((item) => {
    const matchSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      filter === "All" || item.category === filter;

    return matchSearch && matchCategory;
  });

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((e) => e.amount))
      : 0;

  const lowestExpense =
    expenses.length > 0
      ? Math.min(...expenses.map((e) => e.amount))
      : 0;

  const remainingBudget = budget - totalExpense;

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="header">
        <h1>💰 Smart Expense Analytics Dashboard</h1>

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </header>

      <div className="stats-grid">
        <div className="card">
          <h3>Total Expense</h3>
          <p>₹{totalExpense}</p>
        </div>

        <div className="card">
          <h3>Budget</h3>
          <p>₹{budget}</p>
        </div>

        <div className="card">
          <h3>Remaining</h3>
          <p>₹{remainingBudget}</p>
        </div>

        <div className="card">
          <h3>Highest Expense</h3>
          <p>₹{highestExpense}</p>
        </div>

        <div className="card">
          <h3>Lowest Expense</h3>
          <p>₹{lowestExpense}</p>
        </div>
      </div>

      <div className="budget-section">
        <h3>Budget Usage</h3>

        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${Math.min(
                (totalExpense / budget) * 100,
                100
              )}%`,
            }}
          ></div>
        </div>

        <p>
          {Math.round((totalExpense / budget) * 100)}% Used
        </p>
      </div>

      <div className="form-section">
        <input
          type="text"
          placeholder="Expense Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Medical</option>
          <option>Education</option>
          <option>Entertainment</option>
          <option>Bills</option>
          <option>Other</option>
        </select>

        <button onClick={addExpense}>
          Add Expense
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search Expense..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Medical</option>
          <option>Education</option>
          <option>Entertainment</option>
          <option>Bills</option>
          <option>Other</option>
        </select>
      </div>

      <div className="expense-list">
        <h2>Expense History</h2>

        {filteredExpenses.length === 0 ? (
          <p>No Expenses Found</p>
        ) : (
          filteredExpenses.map((item) => (
            <div
              className="expense-card"
              key={item.id}
            >
              <div>
                <h4>{item.title}</h4>
                <small>{item.category}</small>
                <p>{item.date}</p>
              </div>

              <div>
                <strong>₹{item.amount}</strong>

                <button
                  onClick={() => deleteExpense(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}