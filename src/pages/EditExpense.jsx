
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProjects } from "../services/projectService";

import {
  getExpense,
  updateExpense,
} from "../services/expenseService";

import { getEmployeeByEmail } from "../services/timesheetService";

import "../styles/expenses.css";

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [employee, setEmployee] = useState("");
  const [project, setProject] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");

  const [role, setRole] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // =========================
  // TODAY
  // =========================

  const today =
    new Date().toISOString().split("T")[0];

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const currentRole =
        localStorage.getItem("user_role");

      setRole(currentRole);

      // =========================
      // GET PROJECTS
      // =========================

      const projectResult =
        await getProjects();

      console.log(
        "PROJECTS:",
        projectResult
      );

      if (projectResult.errors) {
        console.error(
          "PROJECT ERROR:",
          projectResult.errors
        );
      } else {
        const projectData =
          projectResult.data || [];

        setProjects(projectData);

        // =========================
        // GET EXPENSE
        // =========================

        const result =
          await getExpense(id);

        console.log(
          "EXPENSE:",
          result
        );

        if (
          result.errors ||
          !result.data
        ) {
          alert(
            result.errors?.[0]?.message ||
              "Expense not found."
          );

          navigate("/expenses");
          return;
        }

        const expense =
          result.data;

        // =========================
        // CURRENT VALUES
        // =========================

        const projectId =
          expense.project?.id;

        setProject(
          String(projectId || "")
        );

        setAmount(
          expense.amount ?? ""
        );

        setDescription(
          expense.description || ""
        );

        setExpenseDate(
          expense.expense_date
            ? expense.expense_date.split("T")[0]
            : ""
        );

        // =========================
        // SELECT CURRENT PROJECT
        // =========================

        const currentProject =
          projectData.find(
            (item) =>
              String(item.id) ===
              String(projectId)
          );

        setSelectedProject(
          currentProject || null
        );

        // =========================
        // GET EMPLOYEES
        // MANAGER + ADMINISTRATOR
        // =========================

        if (
          currentRole === "Manager" ||
          currentRole === "Administrator"
        ) {
          const token =
            localStorage.getItem(
              "access_token"
            );

          const response =
            await fetch(
              "/api/items/employees?fields=id,name,email,job_title",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const employeeResult =
            await response.json();

          console.log(
            "EMPLOYEES:",
            employeeResult
          );

          if (
            employeeResult.errors
          ) {
            console.error(
              "EMPLOYEE ERROR:",
              employeeResult.errors
            );
          } else {
            setEmployees(
              employeeResult.data || []
            );
          }

          // =========================
          // CURRENT EMPLOYEE
          // =========================

          setEmployee(
            String(
              expense.employee?.id || ""
            )
          );
        }

      }

    } catch (error) {
      console.error(
        "LOAD EXPENSE ERROR:",
        error
      );

      alert(
        "Failed to load expense."
      );
    }
  }

  // =========================
  // PROJECT CHANGE
  // =========================

  function handleProjectChange(e) {
    const projectId =
      e.target.value;

    setProject(projectId);

    // Clear old date because the
    // project period may have changed.
    setExpenseDate("");

    const foundProject =
      projects.find(
        (item) =>
          String(item.id) ===
          String(projectId)
      );

    setSelectedProject(
      foundProject || null
    );
  }

  // =========================
  // DATE FORMAT
  // =========================

  function formatDate(date) {
    if (!date) {
      return "";
    }

    return date.split("T")[0];
  }

  // =========================
  // PROJECT DATE LIMITS
  // =========================

  const projectStart =
    selectedProject
      ? formatDate(
          selectedProject.start_date
        )
      : "";

  const projectEnd =
    selectedProject
      ? formatDate(
          selectedProject.end_date
        )
      : "";

  // =========================
  // MAX EXPENSE DATE
  // =========================

  /*
    Expense date cannot be:

    1. Before project start.
    2. After project end.
    3. In the future.

    Therefore the maximum allowed
    date is the earlier of:

    Project End
    OR
    Today
  */

  const maxExpenseDate =
    projectEnd &&
    projectEnd < today
      ? projectEnd
      : today;

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
  // SUBMIT
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    // =========================
    // PROJECT VALIDATION
    // =========================

    if (!selectedProject) {
      alert(
        "Please select a project."
      );

      return;
    }

    // =========================
    // PROJECT DATES
    // =========================

    if (
      !projectStart ||
      !projectEnd
    ) {
      alert(
        "This project does not have valid start and end dates."
      );

      return;
    }

    // =========================
    // PROJECT DATE ORDER
    // =========================

    if (projectEnd < projectStart) {
      alert(
        "Project end date cannot be before the start date."
      );

      return;
    }

    // =========================
    // FUTURE PROJECT
    // =========================

    if (projectStart > today) {
      alert(
        "You cannot add an expense to a project that has not started yet."
      );

      return;
    }

    // =========================
    // EXPENSE DATE
    // =========================

    if (!expenseDate) {
      alert(
        "Please select an expense date."
      );

      return;
    }

    // Before project start
    if (expenseDate < projectStart) {
      alert(
        "Expense date cannot be before the project start date."
      );

      return;
    }

    // After project end
    if (expenseDate > projectEnd) {
      alert(
        "Expense date cannot be after the project end date."
      );

      return;
    }

    // Future date
    if (expenseDate > today) {
      alert(
        "You cannot add an expense for a future date."
      );

      return;
    }

    // =========================
    // AMOUNT VALIDATION
    // =========================

    const expenseAmount =
      Number(amount);

    if (!amount) {
      alert(
        "Please enter the expense amount."
      );

      return;
    }

    if (
      !Number.isFinite(expenseAmount) ||
      expenseAmount <= 0
    ) {
      alert(
        "Expense amount must be greater than 0."
      );

      return;
    }

    // =========================
    // EMPLOYEE
    // =========================

    try {
      let employeeId;

      // =========================
      // MANAGER + ADMINISTRATOR
      // =========================

      if (
        role === "Manager" ||
        role === "Administrator"
      ) {
        employeeId =
          Number(employee);

        if (!employeeId) {
          alert(
            "Please select an employee."
          );

          return;
        }
      }

      // =========================
      // EMPLOYEE
      // =========================

      else if (
        role === "Employee"
      ) {
        const email =
          localStorage.getItem(
            "user_email"
          );

        if (!email) {
          alert(
            "Employee email was not found."
          );

          return;
        }

        const employeeResult =
          await getEmployeeByEmail(
            email
          );

        const currentEmployee =
          employeeResult.data?.[0];

        if (!currentEmployee) {
          alert(
            "Employee record not found."
          );

          return;
        }

        employeeId =
          currentEmployee.id;
      }

      // =========================
      // UPDATE EXPENSE
      // =========================

      const result =
        await updateExpense(id, {
          employee: employeeId,
          project: Number(project),
          amount: expenseAmount,
          description:
            description.trim(),
          expense_date: expenseDate,
        });

      console.log(
        "UPDATE EXPENSE RESULT:",
        result
      );

      // =========================
      // API ERROR
      // =========================

      if (result.errors) {
        alert(
          result.errors[0]?.message ||
            "Failed to update expense."
        );

        return;
      }

      // =========================
      // SUCCESS
      // =========================

      alert(
        "Expense updated successfully."
      );

      navigate("/expenses");

    } catch (error) {
      console.error(
        "UPDATE EXPENSE ERROR:",
        error
      );

      alert(
        "Failed to update expense."
      );
    }
  }

  return (
    <div className="expense-page">

      <div className="expense-card">

        {/* =========================
            BACK TO DASHBOARD
        ========================= */}

        <button
          type="button"
          className="back-button"
          onClick={
            goBackToDashboard
          }
        >
          ← Back to Dashboard
        </button>


        {/* =========================
            HEADER
        ========================= */}

        <div className="expense-header">

          <div className="expense-icon">
            ✎
          </div>

          <div>

            <h1>
              Edit Expense
            </h1>

            <p>
              Update the expense information.
            </p>

          </div>

        </div>


        {/* =========================
            FORM
        ========================= */}

        <form
          className="expense-form"
          onSubmit={
            handleSubmit
          }
        >

          {/* =========================
              EMPLOYEE
          ========================= */}

          {(role === "Manager" ||
            role === "Administrator") && (

            <div className="form-group">

              <label>
                Employee
              </label>

              <select
                value={employee}
                onChange={(e) =>
                  setEmployee(
                    e.target.value
                  )
                }
                required
              >

                <option value="">
                  Select Employee
                </option>

                {employees.map(
                  (emp) => (

                    <option
                      key={emp.id}
                      value={emp.id}
                    >
                      {emp.name} -{" "}
                      {emp.job_title}
                    </option>

                  )
                )}

              </select>

            </div>

          )}


          {/* =========================
              PROJECT
          ========================= */}

          <div className="form-group">

            <label>
              Project
            </label>

            <select
              value={project}
              onChange={
                handleProjectChange
              }
              required
            >

              <option value="">
                Select Project
              </option>

              {projects.map(
                (projectItem) => (

                  <option
                    key={
                      projectItem.id
                    }
                    value={
                      projectItem.id
                    }
                  >
                    {
                      projectItem.project_name
                    }
                  </option>

                )
              )}

            </select>

            {/* =========================
                PROJECT PERIOD
            ========================= */}

            {selectedProject && (
              <small
                style={{
                  display: "block",
                  marginTop: "8px",
                  opacity: 0.7,
                }}
              >
                Available period:{" "}
                <strong>
                  {projectStart}
                </strong>
                {" – "}
                <strong>
                  {projectEnd}
                </strong>
              </small>
            )}

          </div>


          {/* =========================
              AMOUNT
          ========================= */}

          <div className="form-group">

            <label>
              Amount (SAR)
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter expense amount"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* =========================
              DESCRIPTION
          ========================= */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              placeholder="Enter expense description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="4"
            />

          </div>


          {/* =========================
              EXPENSE DATE
          ========================= */}

          <div className="form-group">

            <label>
              Expense Date
            </label>

            <input
              type="date"
              value={expenseDate}
              onChange={(e) =>
                setExpenseDate(
                  e.target.value
                )
              }
              min={
                projectStart ||
                undefined
              }
              max={
                selectedProject
                  ? maxExpenseDate
                  : today
              }
              disabled={
                !selectedProject ||
                projectStart > today
              }
              required
            />

            {!selectedProject && (
              <small
                style={{
                  display: "block",
                  marginTop: "8px",
                  opacity: 0.7,
                }}
              >
                Select a project first.
              </small>
            )}

            {selectedProject &&
              projectStart > today && (
                <small
                  style={{
                    display: "block",
                    marginTop: "8px",
                    opacity: 0.7,
                  }}
                >
                  This project has not
                  started yet.
                </small>
              )}

          </div>


          {/* =========================
              BUTTONS
          ========================= */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate(
                  "/expenses"
                )
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={
                !selectedProject ||
                projectStart > today
              }
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditExpense;
