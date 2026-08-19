import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getExpenses,
  deleteExpense,
  getEmployeeByEmail,
} from "../services/expenseService";

import "../styles/expenses.css";

function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const navigate = useNavigate();

  const role = localStorage.getItem("user_role");
  const email = localStorage.getItem("user_email");

  useEffect(() => {
    loadExpenses();
  }, []);

  // =========================
  // BACK TO DASHBOARD
  // =========================

  function goBackToDashboard() {
    if (role === "Administrator") {
      navigate("/admin");
    } else if (role === "Manager") {
      navigate("/dashboard");
    } else if (role === "Employee") {
      navigate("/employee");
    } else {
      navigate("/");
    }
  }

  // =========================
  // LOAD EXPENSES
  // =========================

  async function loadExpenses() {
    try {
      if (role === "Employee") {
        const employeeResult =
          await getEmployeeByEmail(email);

        const employee =
          employeeResult.data?.[0];

        if (!employee) {
          alert("Employee record not found.");
          return;
        }

        const result =
          await getExpenses(employee.id);

        setExpenses(result.data || []);
      } else {
        const result =
          await getExpenses();

        setExpenses(result.data || []);
      }
    } catch (error) {
      console.error(
        "ERROR LOADING EXPENSES:",
        error
      );
    }
  }

  // =========================
  // DELETE EXPENSE
  // =========================

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteExpense(id);

      loadExpenses();
    } catch (error) {
      console.error(
        "DELETE EXPENSE ERROR:",
        error
      );
    }
  }

  // =========================
  // TOTAL EXPENSES
  // =========================

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  return (
    <div className="expenses-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="expenses-header">

        <div>

          <button
            type="button"
            className="back-button"
            onClick={goBackToDashboard}
          >
            ← Back to Dashboard
          </button>

          <h1>
            {role === "Employee"
              ? "My Expenses"
              : "Expenses Management"}
          </h1>

          <p>
            {role === "Employee"
              ? "View and manage your project expenses."
              : "Monitor and manage project expenses."}
          </p>

        </div>

        <Link
          to="/add-expense"
          className="primary-button"
        >
          + Add Expense
        </Link>

      </div>


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="expenses-summary">

        <div className="expense-stat-card">

          <span>
            Total Records
          </span>

          <strong>
            {expenses.length}
          </strong>

        </div>


        <div className="expense-stat-card">

          <span>
            Total Expenses
          </span>

          <strong>
            {totalExpenses.toLocaleString()} SAR
          </strong>

        </div>

      </div>


      {/* =========================
          TABLE
      ========================= */}

      <div className="expenses-table-container">

        {expenses.length === 0 ? (

          <div className="expenses-empty">
            No expenses found.
          </div>

        ) : (

          <table className="expenses-table">

            <thead>

              <tr>

                {role !== "Employee" && (
                  <th>
                    Employee
                  </th>
                )}

                <th>
                  Project
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Description
                </th>

                <th>
                  Date
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {expenses.map((expense) => (

                <tr key={expense.id}>

                  {role !== "Employee" && (
                    <td className="employee-name">
                      {expense.employee?.name || "-"}
                    </td>
                  )}

                  <td className="project-name">
                    {expense.project?.project_name || "-"}
                  </td>

                  <td className="amount-cell">
                    {Number(
                      expense.amount || 0
                    ).toLocaleString()}{" "}
                    SAR
                  </td>

                  <td>
                    {expense.description || "-"}
                  </td>

                  <td>
                    {expense.expense_date
                      ? expense.expense_date.split("T")[0]
                      : "-"}
                  </td>

                 <td>

  <div className="expense-actions">

    <Link
      to={`/edit-expense/${expense.id}`}
      className="edit-button"
    >
      Edit
    </Link>

    {(role === "Manager" ||
  role === "Administrator") && (
  <button
    type="button"
    className="delete-button"
    onClick={() =>
      handleDelete(expense.id)
    }
  >
    Delete
  </button>
)}

  </div>

</td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default Expenses;
