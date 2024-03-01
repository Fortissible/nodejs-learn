export {TodoService}

class TodoService{
  todoList = ["Dummy 1", "Dummy 2", "Dummy 3"];

  getResponseJson(){
    let todoListResponseObject = this.todoList.map((item,idx) =>
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
      this.todoList.push(body.todo)
      resp.write(`Success post a todo: ${body.todo}`)
      resp.end()
    })
  }

  updateTodo(req, resp){
    req.addListener("data", (data)=>{
      const body = JSON.parse(data.toString())
      if (parseInt(body.todoId) <= this.todoList.length-1){
        this.todoList[body.todoId] = body.todo
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
      if (parseInt(body.todoId) <= this.todoList.length-1){
        this.todoList.splice(parseInt(body.todoId),1)
        resp.write(`Success deleting a todo with id ${body.todoId}`)
      } else {
        resp.write(`Failed deleting todo: todo with id ${body.todoId} not found!`)
      }
      resp.end()
    })
  }
}