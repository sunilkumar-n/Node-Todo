require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const {mongoose} = require("./db/mongoose");
const {ObjectID} = require("mongodb");
const {Todo} = require("./models/Todo");
const {User} = require("./models/User");

const app = express();


app.use(bodyParser.json());


app.post("/todos",(req,res)=>{
  var todo = new Todo({
      text:req.body.text
  })

  todo.save().then((doc)=>{
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
      return res.status(404).send("Id is invalid found")

    Todo.findById(id).then((todo)=>{

      if(!todo)
        return res.status(404).send("Id not found")

        res.send({todo})
    },(err)=>{
        res.status(400).send(err);
    })
})


app.delete("/todos/:id",(req,res) =>{
  //check of valid id
  var id = req.params.id;

  if(! ObjectID.isValid(id))
      return res.status(404).send("given id is not valid")

  //findbyidand remove
  Todo.findByIdAndRemove(id).then((todo)=>{
      if(!todo)
          return res.status(404).send("id not found")

      res.send({todo})
  },(err)=>{
      res.status(400).send(err)
  })

})

app.patch("/todos/:id",(req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);
    //validate id
    if(! ObjectID.isValid(id))
      return res.status(404).send("id not found!")

      if(_.isBoolean(body.completed) && body.completed){
          body.completedAt = new Date().getTime();
      }else{
          body.completedAt = null;
      }

      Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
          if(!todo)
            return res.status(404).send("record not found!");

            res.send({todo})
      },(err)=>{
          res.status(400).send(err);
      })
})

const port = process.env.PORT;
console.log("port ="+port);
app.listen(port,()=>{
  console.log(`app is listening to port: ${port}`);
})

module.exports = {app};
