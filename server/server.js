const express = require("express");
const bodyParser = require("body-parser");

const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/Todo");
const {User} = require("./models/User");

const app = express();

app.use(bodyParser.json());


app.post("/todos",(req,res)=>{
  var todo = new Todo({
      text:req.body.text
  })

  todo.save().then((doc)=>{
    console.log(doc)
    res.send(doc)
  },(e)=>{
    res.status(400).send(e)
  })

});

app.get("/todos",(req,res)=>{
   Todo.find().then((todos)=>{
     res.send({
       todos
     })
   },(error)=>{
     res.status(400).send(error);
   })
});


app.listen(3000,()=>{
  console.log("app is listening to port:3000");
})

module.exports = {app};
