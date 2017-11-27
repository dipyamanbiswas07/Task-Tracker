var tasks;

document.addEventListener('DOMContentLoaded', function () {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem('tasks') == null)
            tasks = [];
        else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
            checkTimelineofTasks();
            plotCompleteTaskList();
        }
    }
}, false);

function checkTimelineofTasks() {
    var curDate = getDate();
    var yesDate = getYesterdaysDate();
    tasks = tasks.filter(function (e) {
        return (e.date == curDate || e.date == yesDate)

    })
}


function addTask() {
    if (event.keyCode == 13) {
        if (document.getElementById('taskInput').value != "") {
            var Task = document.getElementById('taskInput').value;
            var curDate = getDate();
            var ID = getLastID() + 1;
            var newTask = {
                task: Task,
                date: curDate,
                isCompleted: 0,
                id: ID
            }
            tasks.push(newTask);
            updateTasks();
            alert('task Added succesfully');
            document.getElementById('taskInput').value = "";
            plotTaskList('1');
        } else {
            alert("Task is Empty");
        }
    }
}

function plotCompleteTaskList() {
    plotTaskList("1");
    plotTaskList("2");
    plotTaskList("3");
}

function plotTaskList(index) {
    var dynamicString = "";

    if (index == 1) {
        var filteredTasks = tasks.filter(function (e) {
            return e.date == getDate() && e.isCompleted == 0
        });
        for (i = 0; i < filteredTasks.length; i++) {
            dynamicString += " <div class='divTaskItem'><div class='divTaskItemName FL' onclick=completeTask(" + filteredTasks[i].id + ") >" + filteredTasks[i].task + "</div><div class='divTaskItemDelete FL' onclick=deleteTask(" + filteredTasks[i].id + "," + index + ")>X</div></div>";
        }
        document.getElementById('divTodaysTaskList').innerHTML = dynamicString;
    } else if (index == 2) {
        var filteredTasks = tasks.filter(function (e) {
            return e.date == getDate() && e.isCompleted == 1
        });
        for (i = 0; i < filteredTasks.length; i++) {
            dynamicString += " <div class='divTaskItem'><div class='divTaskItemName FL' >" + filteredTasks[i].task + "</div><div class='divTaskItemDelete FL' onclick=deleteTask(" + filteredTasks[i].id + "," + index + ")>X</div></div>";
        }
        document.getElementById('divFinishedList').innerHTML = dynamicString;
    } else if (index == 3) {
        var filteredTasks = tasks.filter(function (e) {
            return e.date == getYesterdaysDate()
        });
        for (i = 0; i < filteredTasks.length; i++) {
            dynamicString += " <div class='divTaskItem'><div class='divTaskItemName FL'>" + filteredTasks[i].task + "</div></div>";
        }
        document.getElementById('divTaskHistoryList').innerHTML = dynamicString;
    }
}

function completeTask(id) {
    if (confirm("Are you sure you completed the task?") == true) {
        var index = getIndex(id);
        tasks[index].isCompleted = 1;
        updateTasks();
        plotTaskList("1");
        plotTaskList("2");
    }
}


function getLastID() {
    if (tasks.length > 0) {
        return Math.max.apply(Math, tasks.map(function (o) {
            return o.id;
        }))
    } else
        return 0;
}


function getDate() {
    var date = new Date();
    date.setDate(date.getDate());

    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}


function getYesterdaysDate() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}

function deleteTask(id, index) {
    if (confirm("Are you sure you want to delete the task?") == true) {
        var searchedindex = getIndex(id);
        if (searchedindex > -1) {
            tasks.splice(searchedindex, 1);
            plotTaskList(index);
            updateTasks();
        }
    }
}

function updateTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getIndex(id) {

    var index;
    tasks.some(function (entry, i) {
        if (entry.id == id) {
            index = i;
            return true;
        }
    });
    return index;
}
