const express = require("express");
const bodyParser = require("body-parser");

const {mongoose} = require("./db/mongoose");
const {ObjectID} = require("mongodb");
const {Todo} = require("./models/Todo");
const {User} = require("./models/User");

const app = express();

const port = process.env.port || 3000;

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

app.get("/todos/:id",(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id))
      return res.status(400).send("Id is invalid found")

    Todo.findById(id).then((todo)=>{

      if(!todo)
        return res.status(400).send("Id not found")

        res.send({todo})
    },(err)=>{
        res.status(400).send(err);
    })
})


app.listen(port,()=>{
  console.log(`app is listening to port: ${port}`);
})

module.exports = {app};
