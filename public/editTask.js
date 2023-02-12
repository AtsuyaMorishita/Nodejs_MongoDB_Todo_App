const taskIdDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const editFormDOM = document.querySelector(".single-task-form");
const formAlertDOM = document.querySelector(".form-alert");
const taskCompletedDOM = document.querySelector(".task-edit-completed");

//パラメーターのIDを取得
const params = window.location.search;
const id = new URLSearchParams(params).get("id");

//1つの特定のタスクを取得する
const showTask = async () => {
  try {
    const { data: task } = await axios.get(`/api/v1/tasks/${id}`);
    const { _id, completed, name } = task;

    //タスクIDを表示
    taskIdDOM.textContent = _id;

    //名前を表示
    taskNameDOM.value = name;

    //タスクのチェック状態を表示
    if (completed) {
      taskCompletedDOM.checked = true;
    }
  } catch (err) {
    console.log(err);
  }
};
showTask();

//タスクの編集
editFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    //タスクフォームに入力されている値を取得
    const taskName = taskNameDOM.value;

    //完了・未完了のチェックの状態を取得
    taskCompleted = taskCompletedDOM.checked;

    const { data: task } = await axios.patch(`/api/v1/tasks/${id}`, {
      name: taskName,
      completed: taskCompleted,
    });

    //編集時にメッセージを表示
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = "編集に成功しました";
    formAlertDOM.classList.add("text-success");
  } catch (err) {
    console.log(err);
  }

  //3秒後にメッセージを削除
  setTimeout(() => {
    formAlertDOM.style.display = "none";
  }, 3000);
});
