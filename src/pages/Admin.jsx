import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getUsers,
  updateUser,
  deleteUser,
} from "../services/userService";

import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";

import { getProjects } from "../services/projectService";
import { getTimesheets } from "../services/timesheetService";
import { getExpenses } from "../services/expenseService";

// =========================
// ROLE IDs
// =========================

const ADMIN_ROLE_ID =
  "b6a764f8-1a15-4bc8-8fd7-403759dca547";

const MANAGER_ROLE_ID =
  "9ca82301-b0f4-4fbe-8eeb-b0cae1cadd28";

const EMPLOYEE_ROLE_ID =
  "d38d5877-6920-4926-999b-948babb231ab";

// =========================
// JOB TITLES
// =========================

const JOB_TITLES = [
  "Analyst",
  "Consultant",
  "Senior Consultant",
];

function Admin() {
  // =========================
  // NAVIGATION
  // =========================

  const navigate = useNavigate();

  // =========================
  // DATA
  // =========================

  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // =========================
  // UI STATES
  // =========================

  const [showEmployeeForm, setShowEmployeeForm] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  // =========================
  // EMPLOYEE FORM
  // =========================

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    job_title: "",
  });

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await Promise.all([
      loadUsers(),
      loadEmployees(),
      loadProjects(),
      loadTimesheets(),
      loadExpenses(),
    ]);
  }

  // =========================
  // LOAD USERS
  // =========================

  async function loadUsers() {
    try {
      const result = await getUsers();

      if (result.errors) {
        console.error("LOAD USERS:", result.errors);
        return;
      }

      setUsers(result.data || []);
    } catch (error) {
      console.error("LOAD USERS ERROR:", error);
    }
  }

  // =========================
  // LOAD EMPLOYEES
  // =========================

  async function loadEmployees() {
    try {
      const result = await getEmployees();

      if (result.errors) {
        console.error(
          "LOAD EMPLOYEES:",
          result.errors
        );
        return;
      }

      setEmployees(result.data || []);
    } catch (error) {
      console.error(
        "LOAD EMPLOYEES ERROR:",
        error
      );
    }
  }

  // =========================
  // LOAD PROJECTS
  // =========================

  async function loadProjects() {
    try {
      const result = await getProjects();

      if (result.errors) {
        console.error(
          "LOAD PROJECTS:",
          result.errors
        );
        return;
      }

      setProjects(result.data || []);
    } catch (error) {
      console.error(
        "LOAD PROJECTS ERROR:",
        error
      );
    }
  }

  // =========================
  // LOAD TIMESHEETS
  // =========================

  async function loadTimesheets() {
    try {
      const result = await getTimesheets();

      if (result.errors) {
        console.error(
          "LOAD TIMESHEETS:",
          result.errors
        );
        return;
      }

      setTimesheets(result.data || []);
    } catch (error) {
      console.error(
        "LOAD TIMESHEETS ERROR:",
        error
      );
    }
  }

  // =========================
  // LOAD EXPENSES
  // =========================

  async function loadExpenses() {
    try {
      const result = await getExpenses();

      if (result.errors) {
        console.error(
          "LOAD EXPENSES:",
          result.errors
        );
        return;
      }

      setExpenses(result.data || []);
    } catch (error) {
      console.error(
        "LOAD EXPENSES ERROR:",
        error
      );
    }
  }

  // =========================
  // ADD EMPLOYEE
  // =========================
async function handleAddEmployee(event) {
  event.preventDefault();

  const name = employeeForm.name.trim();
  const email = employeeForm.email.trim();
  const jobTitle = employeeForm.job_title;

  if (!name || !email || !jobTitle) {
    alert("Please fill in all fields.");
    return;
  }

  const emailExists = employees.some(
    (employee) =>
      employee.email?.trim().toLowerCase() ===
      email.toLowerCase()
  );

  if (emailExists) {
    alert(
      "An employee with this email already exists."
    );
    return;
  }

  try {
    const result = await addEmployee({
      name,
      email,
      job_title: jobTitle,
    });

    console.log("ADD EMPLOYEE:", result);

    if (result.errors) {
      alert(
        result.errors[0]?.message ||
          "Failed to add employee."
      );
      return;
    }

    alert("Employee added successfully.");

    setEmployeeForm({
      name: "",
      email: "",
      job_title: "",
    });

    setShowEmployeeForm(false);

    await loadEmployees();

  } catch (error) {
    console.error(
      "ADD EMPLOYEE ERROR:",
      error
    );

    alert("Failed to add employee.");
  }
}

  // =========================
  // EDIT USER
  // =========================

  function handleEditUser(user) {
    setEditingUser({
      id: user.id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      role: user.role?.id || "",
    });
  }

  // =========================
  // SAVE USER
  // =========================

  async function handleSaveUser() {
  if (!editingUser) return;

  const firstName =
    editingUser.first_name.trim();

  const lastName =
    editingUser.last_name.trim();

  const email =
    editingUser.email.trim();

  if (!firstName || !lastName || !email) {
    alert("Please fill in all fields.");
    return;
  }

  // =========================
  // CHECK DUPLICATE EMAIL
  // =========================

  const emailExists = users.some(
    (user) =>
      user.id !== editingUser.id &&
      user.email?.trim().toLowerCase() ===
        email.toLowerCase()
  );

  if (emailExists) {
    alert(
      "A user with this email already exists."
    );
    return;
  }

  try {
    const result = await updateUser(
      editingUser.id,
      {
        first_name: firstName,
        last_name: lastName,
        email,
        role: editingUser.role,
      }
    );

    console.log("UPDATE USER:", result);

    if (result.errors) {
      alert(
        result.errors[0]?.message ||
          "Failed to update user."
      );
      return;
    }

    alert("User updated successfully.");

    setEditingUser(null);

    await loadUsers();

  } catch (error) {
    console.error(
      "UPDATE USER ERROR:",
      error
    );

    alert("Failed to update user.");
  }
}
  // =========================
  // DELETE USER
  // =========================

  async function handleDeleteUser(id) {
    const currentUser = JSON.parse(
      localStorage.getItem("current_user") ||
        "null"
    );

    if (id === currentUser?.id) {
      alert(
        "You cannot delete your own account."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      const result = await deleteUser(id);

      if (!result.ok) {
        alert(
          result.errors?.[0]?.message ||
            "Failed to delete user."
        );
        return;
      }

      alert("User deleted successfully.");

      await loadUsers();
    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      alert("Failed to delete user.");
    }
  }

  // =========================
  // EDIT EMPLOYEE
  // =========================

  function handleEditEmployee(employee) {
    setEditingEmployee({
      id: employee.id,
      name: employee.name || "",
      email: employee.email || "",
      job_title: employee.job_title || "",
    });
  }

  // =========================
  // SAVE EMPLOYEE
  // =========================

 async function handleSaveEmployee() {
  if (!editingEmployee) return;

  const name =
    editingEmployee.name.trim();

  const email =
    editingEmployee.email.trim();

  const jobTitle =
    editingEmployee.job_title;

  if (!name || !email || !jobTitle) {
    alert("Please fill in all fields.");
    return;
  }

  // =========================
  // CHECK DUPLICATE EMAIL
  // =========================

  const emailExists = employees.some(
    (employee) =>
      employee.id !== editingEmployee.id &&
      employee.email?.trim().toLowerCase() ===
        email.toLowerCase()
  );

  if (emailExists) {
    alert(
      "An employee with this email already exists."
    );
    return;
  }

  try {
    const result =
      await updateEmployee(
        editingEmployee.id,
        {
          name,
          email,
          job_title: jobTitle,
        }
      );

    console.log(
      "UPDATE EMPLOYEE:",
      result
    );

    if (result.errors) {
      alert(
        result.errors[0]?.message ||
          "Failed to update employee."
      );
      return;
    }

    alert(
      "Employee updated successfully."
    );

    setEditingEmployee(null);

    await loadEmployees();

  } catch (error) {
    console.error(
      "UPDATE EMPLOYEE ERROR:",
      error
    );

    alert(
      "Failed to update employee."
    );
  }
}
  // =========================
  // DELETE EMPLOYEE
  // =========================

  async function handleDeleteEmployee(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      const result =
        await deleteEmployee(id);

      if (
        result.errors ||
        result.ok === false
      ) {
        alert(
          result.errors?.[0]?.message ||
            "Failed to delete employee."
        );
        return;
      }

      alert(
        "Employee deleted successfully."
      );

      await loadEmployees();
    } catch (error) {
      console.error(
        "DELETE EMPLOYEE ERROR:",
        error
      );

      alert(
        "Failed to delete employee."
      );
    }
  }

  // =========================
  // LOGOUT
  // =========================

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    localStorage.removeItem("current_user");

    navigate("/");
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="admin-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="admin-header">

        <div>

          <p className="dashboard-brand">
            FC
          </p>

          <h1>
            Administrator Dashboard
          </h1>

          <p className="dashboard-welcome">
            Manage users, employees and system data
          </p>

        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* =========================
          OVERVIEW
      ========================= */}

      <section className="admin-section">

        <h2>Overview</h2>

        <div className="stats-grid">

          <div className="stat-card">
            <span>{users.length}</span>
            <p>User Accounts</p>
          </div>

          <div className="stat-card">
            <span>{employees.length}</span>
            <p>Employees</p>
          </div>

          <div className="stat-card">
            <span>{projects.length}</span>
            <p>Projects</p>
          </div>

          <div className="stat-card">
            <span>{timesheets.length}</span>
            <p>Timesheets</p>
          </div>

          <div className="stat-card">
            <span>{expenses.length}</span>
            <p>Expenses</p>
          </div>

        </div>

      </section>

      {/* =========================
          USER ACCOUNTS
      ========================= */}

      <section className="admin-section">

        <div className="section-header">

          <div>

            <h2>User Accounts</h2>

            <p>
              Manage Administrator and
              Manager accounts
            </p>

          </div>

        </div>

        <div className="table-container">

          <table className="admin-table">

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {users.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="empty-cell"
                  >
                    No user accounts found.
                  </td>

                </tr>

              ) : (

                users.map((user) => (

                  <tr key={user.id}>

                    <td>
                      {user.first_name}{" "}
                      {user.last_name}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>

                      <span className="role-badge">
                        {user.role?.name || "-"}
                      </span>

                    </td>

                    <td>

                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEditUser(user)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDeleteUser(
                            user.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =========================
          EDIT USER
      ========================= */}

      {editingUser && (

        <section className="admin-form-section">

          <h3>
            Edit User Account
          </h3>

          <div className="admin-form">

            <div className="form-row">

              <div className="form-group">

                <label>
                  First Name
                </label>

                <input
                  value={
                    editingUser.first_name
                  }
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      first_name:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Last Name
                </label>

                <input
                  value={
                    editingUser.last_name
                  }
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      last_name:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                value={
                  editingUser.email
                }
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    email:
                      e.target.value,
                  })
                }
              />

            </div>

            <div className="form-group">

              <label>
                Role
              </label>

              <select
                value={
                  editingUser.role
                }
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    role:
                      e.target.value,
                  })
                }
              >

                <option
                  value={ADMIN_ROLE_ID}
                >
                  Administrator
                </option>

                <option
                  value={MANAGER_ROLE_ID}
                >
                  Manager
                </option>

                <option
                  value={EMPLOYEE_ROLE_ID}
                >
                  Employee
                </option>

              </select>

            </div>

            <div className="form-actions">

              <button
                className="primary-button"
                onClick={
                  handleSaveUser
                }
              >
                Save Changes
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  setEditingUser(null)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </section>

      )}

      {/* =========================
          EMPLOYEES
      ========================= */}

      <section className="admin-section">

        <div className="section-header">

          <div>

            <h2>Employees</h2>

            <p>
              Employee records managed by
              the Administrator
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowEmployeeForm(
                (current) => !current
              )
            }
          >
            {showEmployeeForm
              ? "Cancel"
              : "+ Add Employee"}
          </button>

        </div>

        <div className="table-container">

          <table className="admin-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Job Title</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {employees.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="empty-cell"
                  >
                    No employees found.
                  </td>

                </tr>

              ) : (

                employees.map(
                  (employee) => (

                    <tr
                      key={employee.id}
                    >

                      <td>
                        {employee.id}
                      </td>

                      <td>
                        {employee.name}
                      </td>

                      <td>
                        {employee.email}
                      </td>

                      <td>

                        <span className="job-badge">
                          {employee.job_title}
                        </span>

                      </td>

                      <td>

                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEditEmployee(
                              employee
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteEmployee(
                              employee.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =========================
          ADD EMPLOYEE
      ========================= */}

      {showEmployeeForm && (

        <section className="admin-form-section">

          <h3>
            Add Employee
          </h3>

          <form
            className="admin-form"
            onSubmit={
              handleAddEmployee
            }
          >

            <div className="form-group">

              <label>
                Name
              </label>

              <input
                value={
                  employeeForm.name
                }
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    name:
                      e.target.value,
                  })
                }
                placeholder="Enter employee name"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                value={
                  employeeForm.email
                }
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    email:
                      e.target.value,
                  })
                }
                placeholder="Enter employee email"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Job Title
              </label>

              <select
                value={
                  employeeForm.job_title
                }
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    job_title:
                      e.target.value,
                  })
                }
                required
              >

                <option value="">
                  Select Job Title
                </option>

                {JOB_TITLES.map(
                  (job) => (

                    <option
                      key={job}
                      value={job}
                    >
                      {job}
                    </option>

                  )
                )}

              </select>

            </div>

            <div className="form-actions">

              <button
                type="submit"
                className="primary-button"
              >
                Save Employee
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setShowEmployeeForm(false);

                  setEmployeeForm({
                    name: "",
                    email: "",
                    job_title: "",
                  });
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </section>

      )}

      {/* =========================
          EDIT EMPLOYEE
      ========================= */}

      {editingEmployee && (

        <section className="admin-form-section">

          <h3>
            Edit Employee
          </h3>

          <div className="admin-form">

            <div className="form-group">

              <label>
                Name
              </label>

              <input
                value={
                  editingEmployee.name
                }
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    name:
                      e.target.value,
                  })
                }
              />

            </div>

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                value={
                  editingEmployee.email
                }
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    email:
                      e.target.value,
                  })
                }
              />

            </div>

            <div className="form-group">

              <label>
                Job Title
              </label>

              <select
                value={
                  editingEmployee.job_title
                }
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    job_title:
                      e.target.value,
                  })
                }
              >

                <option value="">
                  Select Job Title
                </option>

                {JOB_TITLES.map(
                  (job) => (

                    <option
                      key={job}
                      value={job}
                    >
                      {job}
                    </option>

                  )
                )}

              </select>

            </div>

            <div className="form-actions">

              <button
                className="primary-button"
                onClick={
                  handleSaveEmployee
                }
              >
                Save Changes
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  setEditingEmployee(null)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </section>

      )}

      {/* =========================
          SYSTEM MANAGEMENT
      ========================= */}

      <section className="admin-section">

        <h2>
          System Management
        </h2>

        <div className="system-links">

          <Link to="/projects">
            <button>
              Projects
            </button>
          </Link>

          <Link to="/timesheets">
            <button>
              Timesheets
            </button>
          </Link>

          <Link to="/expenses">
            <button>
              Expenses
            </button>
          </Link>

          <Link to="/reports">
            <button>
              Reports
            </button>
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Admin;