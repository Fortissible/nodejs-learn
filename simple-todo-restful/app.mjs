import http from "http";
import { TodoService } from "./service/todo-service.mjs";

const todoService = new TodoService();
const server = http.createServer((req, resp)=>{
  resp.setHeader('Content-Type','application/json');
  if(req.method === "GET"){
    todoService.getTodoList(req, resp)
  } else if (req.method === "POST"){
    todoService.postTodo(req, resp)
  } else if (req.method === "PUT"){
    todoService.updateTodo(req, resp)
  } else if (req.method === "DELETE"){
    todoService.deleteTodo(req, resp)
  }
});

server.listen(3000);