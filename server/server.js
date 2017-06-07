require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const {mongoose} = require("./db/mongoose");
const {ObjectID} = require("mongodb");
const bcrypt = require("bcryptjs");

const {Todo} = require("./models/Todo");
var {User} = require("./models/User");
var {authenticate} = require("./middleware/authenticate");

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

//create routes for User
app.post("/users",(req,res)=>{
    var body = _.pick(req.body,["email","password"]);

    var user = new User(body);
    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header("x-auth",token).send(user)
    }).catch((err)=>res.status(400).send(err))
});

//route of me
app.get("/users/me",authenticate, (req,res)=>{
    res.send(req.user)
});

//route for login
app.post("/users/login",(req,res)=>{
    var userObj = _.pick(req.body,["email","password"]);

    User.validateCredentials(userObj.email,userObj.password).then((user)=>{
          return user.generateAuthToken().then((token)=>{
              res.header("x-auth",token).send(user)
          })
    }).catch ((err) =>{res.status(400).send();})

})

//route for deleting token
app.delete("/users/me/token", authenticate, (req,res)=>{
    req.user.removeToken(req.token).then((result)=>{
      res.status(200).send()
    },(err)=>{
        res.status(400).send()
    })
})

const port = process.env.PORT;

console.log("port ="+port);
app.listen(port,()=>{
  console.log(`app is listening to port: ${port}`);
})

module.exports = {app};
