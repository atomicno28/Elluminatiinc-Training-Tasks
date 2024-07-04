document.addEventListener("DOMContentLoaded", (event) => {
  let currentPage = 1;
  const content = document.querySelector(".content");

  async function getTotalPages() {
    const response = await fetch("/count");
    const total = await response.json();
    return Math.ceil(total / 5);
  }

  async function changePage(direction) {
    currentPage += direction;
    const totalPages = await getTotalPages();

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    history.pushState({}, "", `/?page=${currentPage}`);

    const urlParams = new URLSearchParams(window.location.search);
    const page = Number(urlParams.get("page"));

    fetch(`http://localhost:3000/data?page=${page}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const tableBody = document.getElementById("tablebody");
        tableBody.innerHTML = "";

        data.forEach((user, index) => {
          const row = document.createElement("tr");
          row.id = user._id;

          ["username", "email", "phone"].forEach((field) => {
            const cell = document.createElement("td");
            cell.textContent = user[field];
            row.appendChild(cell);
          });

          const buttonCell = document.createElement("td");
          ["Edit", "Delete"].forEach((buttonText) => {
            const button = document.createElement("button");
            button.textContent = buttonText;
            if (buttonText === "Edit") {
              button.onclick = () => toggleEdit(user._id);
            } else if (buttonText === "Delete") {
              button.onclick = () => deleteItem(user._id);
            }
            buttonCell.appendChild(button);
          });

          row.appendChild(buttonCell);

          tableBody.appendChild(row);

          const editRow = document.createElement("tr");
          editRow.className = user._id;
          editRow.style.display = "none";

          const formCell = document.createElement("td");
          const form = document.createElement("form");
          form.action = "/";
          form.className = "editForm";
          form.dataset.userId = user._id;
          form.dataset.index = index;

          const select = document.createElement("select");
          select.id = "editOption" + index;
          select.name = "editOption";
          ["username", "email", "phone"].forEach((optionText) => {
            const option = document.createElement("option");
            option.value = optionText;
            option.textContent = optionText;
            select.appendChild(option);
          });
          form.appendChild(select);

          const input = document.createElement("input");
          input.type = "text";
          input.id = "editInput" + index;
          input.name = "editInput";
          form.appendChild(input);

          const button = document.createElement("button");
          button.id = "editButton" + index;
          button.type = "submit";
          button.textContent = "Update";
          form.appendChild(button);

          formCell.appendChild(form);
          editRow.appendChild(formCell);

          tableBody.appendChild(editRow);
        });
      })

      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }

  const prevButton = document.createElement("button");
  prevButton.id = "prev";
  prevButton.textContent = "Prev";
  prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
      changePage(-1);
    }
  });

  const nextButton = document.createElement("button");
  nextButton.id = "next";
  nextButton.textContent = "Next";
  nextButton.addEventListener("click", function () {
    changePage(1);
  });

  content.appendChild(prevButton);
  content.appendChild(nextButton);

  changePage(0);

  async function deleteItem(id) {
    try {
      const response = await fetch(`/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // If the deletion is successful, remove the table row from the DOM
      var row = document.getElementById(id);
      row.parentNode.removeChild(row);
      var tdow = document.getElementsByClassName(id);
      for (var i = 0; i < tdow.length; i++) {
        tdow[i].remove();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
  function toggleEdit(userId) {
    var editRows = document.getElementsByClassName(userId);
    for (var i = 0; i < editRows.length; i++) {
      editRows[i].style.display =
        editRows[i].style.display === "none" ? "table-row" : "none";
    }
  }

  function handleUpdate(userId, field, index) {
    const editOption = document.querySelector("#editOption" + index);
    const editInput = document.querySelector("#editInput" + index);

    // Clear any existing error messages
    document.querySelector("#Error").textContent = "";

    // Check for empty fields
    if (!editInput.value) {
      document.querySelector("#Error").textContent = "Field cannot be empty.";
      return;
    }

    // Prepare data to be sent
    const data = {
      field: editOption.value,
      value: editInput.value,
    };

    // Make Fetch PATCH request
    fetch(`/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          // Success, handle accordingly
          response.json().then((responseData) => {
            console.log("Update successful:", responseData);

            // Update the table row with the new data
            var tableRow = document.getElementById(userId);
            tableRow.cells[0].innerText =
              editOption.value === "username"
                ? editInput.value
                : tableRow.cells[0].innerText;
            tableRow.cells[1].innerText =
              editOption.value === "email"
                ? editInput.value
                : tableRow.cells[1].innerText;
            tableRow.cells[2].innerText =
              editOption.value === "phone"
                ? editInput.value
                : tableRow.cells[2].innerText;

            // Hide the edit row again
            document.querySelector(`tr.${userId}`).style.display = "none";

            // Clear the input fields
            editOption.value = "";
            editInput.value = "";
          });
        } else {
          // Validation error, display error message
          response.json().then((errorData) => {
            console.error("Validation error:", errorData);
            document.querySelector("#Error").textContent = errorData.message;
          });
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

  const editForms = document.getElementsByClassName("editForm");

  Array.from(editForms).forEach(function (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleUpdate(
        e.target.dataset.userId,
        e.target.querySelector("#editOption" + e.target.dataset.index).value,
        e.target.dataset.index
      );
    });
  });
});
