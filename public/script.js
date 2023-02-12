const tasksDOM = document.querySelector(".tasks");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");

// /api/v1/tasksからタスクを表示する
const showTasks = async () => {
  try {
    //自作のAPIを叩く
    const { data: tasks } = await axios.get("/api/v1/tasks");

    //タスクが1つもない時
    if (tasks.length < 1) {
      tasksDOM.innerHTML = `<h5 class="empty-list">タスクがありません。</h5>`;
      return;
    }

    //タスクを出力
    const allTasks = tasks
      .map((task) => {
        const { completed, _id, name } = task;

        return `
          <div class="single-task ${completed && "task-completed"}">
            <h5>
              <span><i class="far fa-check-circle"></i></span>
              ${name}
            </h5>
            <div class="task-links">
              <a href="edit.html?id=${_id}" class="edit-link">
                <i class="fas fa-edit"></i>
              </a>
              <button type="button" class="delete-btn" data-id="${_id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      })
      .join(""); //カンマを取り除く
    tasksDOM.innerHTML = allTasks;
  } catch (err) {
    console.log(err);
  }
};
showTasks();

//タスクを新規作成する
formDOM.addEventListener("submit", async (event) => {
  //submitでのページリロードを止める
  event.preventDefault();
  //フォームに入力された値を格納
  const name = taskInputDOM.value;

  try {
    await axios.post("/api/v1/tasks", { name: name });
    showTasks();
    taskInputDOM.value = "";
    //追加時にメッセージを表示
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = "タスクを追加しました";
    formAlertDOM.classList.add("text-success");
  } catch (err) {
    console.log(err);
    //エラー時にメッセージを表示
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = "無効です。もう一度やり直してください。";
  }

  //3秒後にメッセージを削除
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});

//タスクを削除する
tasksDOM.addEventListener("click", async (event) => {
  const element = event.target;

  if (element.parentElement.classList.contains("delete-btn")) {
    try {
      const id = element.parentElement.dataset.id;
      await axios.delete(`/api/v1/tasks/${id}`);
      showTasks();
    } catch (err) {
      console.log(err);
    }
  }
});
