const optionList = document.getElementById("optionList").querySelectorAll("li");
optionList[0].classList.add("selected");
// Add event listeners to handle list item selection
optionList.forEach((option) => {
  option.addEventListener("click", function () {
    // Remove the "selected" class from all list items
    optionList.forEach((item) => {
      item.classList.remove("selected");
    });

    // Add the "selected" class to the clicked list item
    option.classList.add("selected");
  });
});
 

 

document.querySelector(".logout").addEventListener("click", () => {
  localStorage.clear();
  location.href = "loginPage.html";
});

document.getElementById('TaskForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const duedate = document.getElementById('duedate').value;
    const priority = document.getElementById('priority').value;

    const taskData = {
        title,
        desc,
        duedate,
        priority,
        completed
    };

    // Make a POST request to the server
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task created successfully:', data);
        
        createTaskRecord(data.task);
    })
    .catch(error => {
        console.error('Error creating task:', error);
       
    });
});

 
// create task
function createTaskRecord(record) {
    const holder = document.createElement("div");
    holder.classList.add("infoDiv");  
  
    const title = document.createElement("h4");
    title.textContent = record.title; 
    holder.appendChild(title);
  
    const desc = document.createElement("p");
    desc.textContent = `Description: ${record.desc}`; 
    holder.appendChild(desc);
  
    const duedate = document.createElement("p");
    duedate.textContent = `Due Date: ${record.duedate}`;
    holder.appendChild(duedate);
  
    const priority = document.createElement("p");
    priority.textContent = `Priority: ${record.priority}`;
    holder.appendChild(priority);
  
    const btnContainer = document.createElement("div");
    const btnEdit = document.createElement("button");
    btnEdit.classList.add("edit");
    btnEdit.innerText = "Edit";
    btnEdit.addEventListener("click", function() {
      editTask(record.title);  
    });
  
    const btnDelete = document.createElement("button");
    btnDelete.classList.add("delete");
    btnDelete.innerText = "Delete";
    btnDelete.addEventListener("click", function() {
      deleteTask(record.title);  
    });
  
    btnContainer.appendChild(btnEdit);
    btnContainer.appendChild(btnDelete);
    holder.appendChild(btnContainer);
  
    document.getElementById("listContainer").appendChild(holder); 
  }
  function deleteTask(taskTitle) {
    // Make a DELETE request to the server
    fetch(`/tasks/${taskTitle}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Task deleted successfully:', data);
       
        document.getElementById("listContainer").removeChild(
          document.getElementById(encodeURIComponent(data.task.title))
        );
      })
      .catch(error => {
        console.error('Error deleting task:', error);
        
      });
  }


function editTask(taskTitle) {
  console.log("Editing task:", taskTitle);

  
  fetch(`/tasks/${taskTitle}`)
    .then(response => response.json())
    .then(task => {
      
      document.getElementById('Title').value = task.title;
      document.getElementById('Desc').value = task.desc;
      document.getElementById('DueDate').value = task.duedate;
      document.getElementById('Priority').value = task.priority;
      document.getElementById("updatetask").style.display = "block";
      document.querySelector('input[type="submit"]').style.display = 'none';
    })
    .catch(error => {
      console.error('Error fetching task details:', error);
    });
}

function UpdateInfoForm() {
 

  event.preventDefault();

  const updatedTask = {
    title: document.getElementById("title").value,
    desc: document.getElementById("desc").value,
    dueDate: document.getElementById("duedate").value,
    priority: document.getElementById("priority").value,
    completed: document.getElementById("completed").checked,  
  };

  console.log(updatedTask);

  fetch(`/tasks/${(Tasktitle)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      
      alert("Task details updated successfully!");
      document.getElementById("updateTaskButton").style.display = "none";
    })
    .catch((error) => {
      console.error("API call error:", error);
      showNotification("Failed to update task details", 1000);
    });
}

function searchTasks() {
  
  const searchQuery = document.getElementById('searchemp').value;

   
  fetch(`/search?query=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
          
          const tasks = data.tasks;
 
          console.log(tasks);
      })
      .catch(error => {
          console.error('Error searching tasks:', error);
      });
}

async function sortTasks(order) {
  try {
      const response = await fetch(`/tasks/sort?order=${order}`);
      const data = await response.json();

      if (response.ok) {
          displayTasks(data.tasks);
      } else {
          console.error(`Error: ${data.error}`);
      }
  } catch (error) {
      console.error('Fetch error:', error);
  }
}

function displayTasks(tasks) {
  const taskListDiv = document.getElementById('taskList');
  taskListDiv.innerHTML = '';

  tasks.forEach(task => {
      const taskDiv = document.createElement('div');
      taskDiv.textContent = `Title: ${task.title}, Due Date: ${task.dueDate}`;
      taskListDiv.appendChild(taskDiv);
  });
}

 