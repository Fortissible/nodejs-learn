export {TodoService}

import { todoList } from "simple-todo-restful/data/todoModel"

class TodoService{

  getResponseJson(){
    let todoListResponseObject = todoList.map((item,idx) =>
      ({
        id: idx,
        todo: item
      })
    )
    let responseString = JSON.stringify({
      code: 200,
      status: "Ok",
      data: todoListResponseObject
    })
    return responseString
  }

  getTodoList(req, resp){
    let responseJson = this.getResponseJson()
    resp.write(responseJson)
    resp.end()
  }

  postTodo(req, resp){
    req.addListener("data", (data)=>{
      const body = JSON.parse(data.toString());
      todoList.push(body.todo)
      resp.write(`Success post a todo: ${body.todo}`)
      resp.end()
    })
  }

  updateTodo(req, resp){
    req.addListener("data", (data)=>{
      const body = JSON.parse(data.toString())
      if (parseInt(body.todoId) <= todoList.length-1){
        todoList[body.todoId] = body.todo
        resp.write(`Success updating a todo with id ${body.todoId}: ${body.todo}`)
      } else {
        resp.write(`Failed updating todo: todo with id ${body.todoId} not found!`)
      }
      resp.end()
    })
  }

  deleteTodo(req, resp){
    req.addListener("data", (data)=>{
      const body = JSON.parse(data.toString())
      if (parseInt(body.todoId) <= todoList.length-1){
        todoList.splice(parseInt(body.todoId),1)
        resp.write(`Success deleting a todo with id ${body.todoId}`)
      } else {
        resp.write(`Failed deleting todo: todo with id ${body.todoId} not found!`)
      }
      resp.end()
    })
  }
}