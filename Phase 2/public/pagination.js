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
});
