import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";

function Expenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    const result = await getExpenses();
    setExpenses(result.data);
  }

  return (
    <div>
      <h1>Expenses</h1>

      <Link to="/add-expense">
        <button>Add Expense</button>
      </Link>

      <br />
      <br />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Project</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.project?.project_name}</td>
              <td>{expense.amount}</td>
              <td>{expense.description}</td>
              <td>{expense.expense_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Expenses;