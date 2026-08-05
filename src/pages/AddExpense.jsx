import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../services/projectService";
import { addExpense } from "../services/expenseService";

function AddExpense() {
  const [projects, setProjects] = useState([]);

  const [project, setProject] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const result = await getProjects();
    setProjects(result.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await addExpense({
      employee: 1,
      project: project,
      amount: Number(amount),
      description: description,
      expense_date: expenseDate,
    });

    navigate("/expenses");
  }

  return (
    <div>
      <h1>Add Expense</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Project</label>
          <br />
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
          >
            <option value="">Select Project</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Amount</label>
          <br />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Expense Date</label>
          <br />
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Save Expense
        </button>
      </form>
    </div>
  );
}

export default AddExpense;