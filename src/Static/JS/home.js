let userEmail = "";
let todos = [];

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const themeToggle = document.getElementById("theme-toggle");
  const logoutButton = document.getElementById("logOutBtn");

  searchInput.addEventListener("input", () => {
    filterAndSortTodos();
  });

  sortSelect.addEventListener("change", () => {
    filterAndSortTodos();
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = themeToggle.querySelector("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
  });

  function createConfirmDialog(
    message = "Are you sure you want to proceed with this action?"
  ) {
    const dialogHTML = `
        <style>
            .dialog-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .dialog-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .dialog-box {
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                font-family: Arial, sans-serif;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .dialog-overlay.active .dialog-box {
                transform: scale(1);
            }

            .dialog-box h2 {
                margin-top: 0;
            }

            .dialog-box p {
                margin-bottom: 20px;
            }

            .dialog-box button {
                padding: 10px 20px;
                margin: 0 10px;
                font-size: 14px;
                cursor: pointer;
                border: none;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }

            .dialog-box .confirm-btn {
                background-color: #4CAF50;
                color: white;
            }

            .dialog-box .cancel-btn {
                background-color: #f44336;
                color: white;
            }

            .dialog-box button:hover {
                opacity: 0.8;
            }
        </style>
        <div class="dialog-overlay" id="dialogOverlay">
            <div class="dialog-box">
                <h2>Confirm Action</h2>
                <p>${message}</p>
                <button class="confirm-btn" id="confirmBtn">Confirm</button>
                <button class="cancel-btn" id="cancelBtn">Cancel</button>
            </div>
        </div>
    `;

    const dialogContainer = document.createElement("div");
    dialogContainer.innerHTML = dialogHTML;
    document.body.appendChild(dialogContainer);

    const dialogOverlay = document.getElementById("dialogOverlay");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    return new Promise((resolve) => {
      dialogOverlay.classList.add("active");

      function closeDialog(result) {
        dialogOverlay.classList.remove("active");
        setTimeout(() => {
          document.body.removeChild(dialogContainer);
        }, 300);
        resolve(result);
      }

      confirmBtn.addEventListener("click", () => closeDialog(true), {
        once: true,
      });
      cancelBtn.addEventListener("click", () => closeDialog(false), {
        once: true,
      });
      dialogOverlay.addEventListener(
        "click",
        (e) => {
          if (e.target === dialogOverlay) {
            closeDialog(false);
          }
        },
        { once: true }
      );
    });
  }

  async function getCurrentUser() {
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        currentUserEmail = data.email;
      } else {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/";
          return;
        }

        try {
          const response = await fetch("/session/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            currentUserEmail = data.email;
          } else {
            window.location.href = "/";
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          window.location.href = "/";
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  async function fetchTodos() {
    try {
      const response = await fetch(`/api/todos?email=${currentUserEmail}`);
      todos = await response.json();
      filterAndSortTodos();
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  async function addTodo(text) {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, email: currentUserEmail }),
      });
      const newTodo = await response.json();
      todos.push(newTodo);
      filterAndSortTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  async function updateTodo(id, completed) {
    try {
      await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      const todoIndex = todos.findIndex((todo) => todo._id === id);

      if (todoIndex !== -1) {
        todos[todoIndex].completed = completed;
      }

      filterAndSortTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  async function deleteTodo(id) {
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      todos = todos.filter((todo) => todo._id !== id);
      filterAndSortTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  function filterAndSortTodos() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortOption = sortSelect.value;

    let filteredTodos = todos.filter((todo) =>
      todo.text.toLowerCase().includes(searchTerm)
    );

    filteredTodos.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      switch (sortOption) {
        case "text-asc":
          return a.text.localeCompare(b.text);
        case "text-desc":
          return b.text.localeCompare(a.text);
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    renderTodos(filteredTodos);
  }

  function renderTodos(todos) {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    todos.forEach(renderTodo);
  }

  function renderTodo(todo) {
    const li = document.createElement("li");
    li.id = todo._id;
    li.className = "todo-item";
    li.innerHTML = `
                <input type="checkbox" ${todo.completed ? "checked" : ""}>
                <span>${todo.text}</span>
                <button class="delete-btn">Delete</button>
            `;
    li.querySelector("input").addEventListener("change", (e) => {
      updateTodo(todo._id, e.target.checked);
    });
    li.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTodo(todo._id);
    });
    document.getElementById("todo-list").appendChild(li);
  }

  logoutButton.addEventListener("click", async () => {
    const userEmail = currentUserEmail;
    const confirmation = await createConfirmDialog(
      "Are you sure you want to log out?"
    );

    if (confirmation) {
      localStorage.removeItem("token");
      window.location.href = "/";

      fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Logout successful") {
            window.location.href = "/";
          } else {
            alert(data.message || "Failed to logout. Please try again.");
          }
        })
        .catch((error) => console.error("Logout error:", error));
    }
  });

  document.getElementById("todo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("todo-input");
    if (input.value.trim()) {
      addTodo(input.value.trim());
      input.value = "";
    }
  });

  async function init() {
    await getCurrentUser();
    await fetchTodos();
  }

  init();
});
