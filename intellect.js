express = require('express');
http = require('http');
fs = require('fs');
url = require("url");
app = express();

server = app.listen(2020, function(req, res) {
    console.log("server running");
});

app.get("/userdetOnId", function(req, res) {
    userID = req.query.id;
    userRespData = userDet(userID, "id");
    resp = (typeof userRespData == "undefined") ? {"respcode": 1, "msg": "User Not Available"} : userRespData;
    res.end(JSON.stringify(resp));
});


app.get("/todosOnId", function(req, res) {
    toId = req.query.id;
    todoRespData = toDos(toId, "id");
    resp = (typeof todoRespData == "undefined") ? {"respcode": 1, "msg": "Todo Not Available"} : todoRespData;
    res.end(JSON.stringify(resp));
});

app.get("/allActUserNTodos", function(req, res) {
    userRespData = userDet('', "activeuser");
    activeUserNTodoResp = [];
    userRespData.forEach(function(obj) {
        tempObj = {"user": obj, "todos": toDos(obj.id, "id")};
        activeUserNTodoResp.push(tempObj);
    });
    res.end(JSON.stringify(activeUserNTodoResp));
});

app.get("/targetDate", function(req, res) {
    userTargetDate = req.query.date;
    targetDateResp = toDos(userTargetDate, 'targetDate');
    resp = (typeof targetDateResp == "undefined") ? {"respcode": 1, "msg": "Todo Not Available"} : targetDateResp;
    res.send(JSON.stringify(resp));
});


function userDet(userId, flag) {
    userFileName = "userDet.json";
    userObj = JSON.parse(fs.readFileSync(userFileName));
    if (flag.localeCompare('id') == 0) {
        for (key in userObj) {
            if (key == userId) {
                return userObj[userId];
            }
        }
    } else if (flag.localeCompare('activeuser') == 0) {//isActive
        respArr = [];
        for (key in userObj) {
            if (userObj[key].isActive == true) {
                respArr.push(userObj[key]);
            }
        }
        return respArr;
    } else {
        return undefined;
    }
}


function toDos(todoId, flag) {
    todoFileName = "todos.json";
    todoObj = JSON.parse(fs.readFileSync(todoFileName));
    if (flag.localeCompare("id") == 0) {
        for (var key in todoObj) {
            if (key == todoId) {
                return todoObj[todoId];
            }
        }
    } else if (flag.localeCompare("targetDate") == 0) {
        targetDate = [];
        for (var key in todoObj) {
            if (todoId.localeCompare(todoObj[key].targetDate) == 0) {
                targetDate.push(todoObj[key]);
            }
        }
        return targetDate;
    } else {
        return undefined;
    }
}
