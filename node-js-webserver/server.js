import http from "http"

const requestListener = (req, resp) => {
  console.log("Hay connected")
  resp.setHeader('Content-Type', 'text/html')

  resp.statusCode = 200

  if (req.method == "GET"){
    resp.end("<h1>Test GET!</h1>")
  } else if (req.method == "POST"){
    let body = []
    req.on('data',(dataChunk)=>{
      body.push(dataChunk)
    })
    req.on('end',(dataChunk)=>{
      body = Buffer.concat(body).toString();
      const { name } = JSON.parse(body);
      resp.end(`<h1>Test POST! Data get : ${name}</h1>`)
    })
  } else{
    resp.end("<h1>Test PUT/DEL!</h1>")
  }
}

const server = http.createServer(requestListener)

const port = 3000
const host = "localhost"

server.listen(port, host, ()=>{
  console.log(`Server running on ${host}:${toString(port)}`)
})