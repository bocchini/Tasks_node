const express = require('express')
const server = express()
server.use(express.json())

let tasksToAccomplish = [{
  id: '1',
  title: '|Novo Projet',
  tasks:[ 'nova tarefa']
}]

let requisition = 0


//*******     Operations     *********
function taskSaveOperation(newTask) {
  tasksToAccomplish = []
  tasksToAccomplish = [ ...newTask]
}
const checkId = (id) => tasksToAccomplish.find( task => task.id === id )

const spliceArray = (id) => tasksToAccomplish.filter( task => task.id != id)
   
const updateTitle = (id, updateTitle) => tasksToAccomplish.map( task => {
  if (task.id === id) {
    task.title = updateTitle
  }
  return task
})

const updateTask = (id, updateTask) => tasksToAccomplish.map( task => {
  if (task.id === id) {
    task.tasks.push(updateTask)

  }
  return task
})


// *******   Middlewares      ********************
server.use((req, res, next) =>{
  requisition ++
  console.log(`Requiition total = ${requisition}`)
  //Passa para a próxima função
  return next()
})

function checkIdExists(req, res, next) {
  const id = req.body.id

  if(checkId(id)){
    return (res.status(400).json({ Error: "Id exists"}))
  }
  next()
  
}

//******    Routes ******

//All Tasks
server.get('/projects', (req,resp) =>{
  return resp.json(tasksToAccomplish)
})


//Add task
server.post('/projects/:id', checkIdExists, (req, resp) =>{
  const { id } = req.params
  const newTask = req.body
  tasksToAccomplish.push(newTask)

  return resp.json(tasksToAccomplish)
})


//Update Title Task
server.put('/projects/:id', checkIdExists, (req, resp)=>{
  const { id } = req.params
  const {title } = req.body

  let olsTask = updateTitle(id, title)
  taskSaveOperation(olsTask)
  return resp.json(tasksToAccomplish)
})

//Add tasks into task
server.post('/projects/:id/tasks', checkIdExists ,(req,resp)=> {
  const { id } = req.params
  const { tasks } = req.body

  const newTasks = updateTask(id, tasks)
  taskSaveOperation(newTasks)
  return resp.json(tasksToAccomplish)
})


server.delete('/projects/:id', checkIdExists,(req, resp) =>{
  const { id } = req.params
  if(checkId(id)){
     let array = spliceArray(id)

     taskSaveOperation(array)

    return resp.send()
  }
  return res.status(400).json({ error: 'User doesn´t exists'})
})

server.listen(3000, function(){
  console.log('Running 3000')
})