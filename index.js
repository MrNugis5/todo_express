const express = require("express")
const app = express()
const fs = require("fs");

const path = require("path")
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                console.error(err)
                return;
            }
            const tasks = JSON.parse(data)
            resolve(tasks)
        })
    })
}
const writeFile = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.error(err)
                return;
            }
            resolve(true)
        })
    })
}

app.get("/", (req, res) => {
    readFile("./tasks.json").then((tasks) => {
        console.log(tasks)
        res.render("index", { tasks: tasks })
    })
})

app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
    readFile("./tasks.json").then((tasks) => {
        let index
        if(tasks.length === 0){
            index = 0
        }
        else{
            index = tasks[tasks.length - 1].id + 1
        }
        const newtask = {
            id: index,
            task: req.body.task
        }
        tasks.push(newtask)
        console.log(newtask)
        data = JSON.stringify(tasks, null, 2)
        writeFile("./tasks.json", data)
        res.redirect("/")
        
})
})

app.get("/delete-task/:taskId", (req, res) => {
    let deletedTaskId = req.params.taskId
    readFile("./tasks.json").then((tasks) => {

        tasks.forEach((task, index) => {

            if(task.id == deletedTaskId){
                tasks.splice(index, 1)
            }
        })
        const data = JSON.stringify(tasks, null, 2)
        writeFile("./tasks.json", data)
        res.redirect("/")
    })})

            
        
 

app.listen(3001, () =>{
    console.log("Example app is started at http://localhost:3001")
} )