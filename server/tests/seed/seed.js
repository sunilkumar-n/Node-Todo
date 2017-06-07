const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");

const {Todo} = require("./../../models/Todo");
const {User} = require("./../../models/User");

const todos = [
  {
    "_id":new ObjectID(),
    "text":"this is for testing1"
  },
  {
    "_id":new ObjectID(),
    "text":"this is for testing2",
    "completed":true,
    "completedAt":343
  }
]

const populateTodos = (done) =>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos)
  }).then(() =>done());
}

var userOneId = new ObjectID();
var userTwoId = new ObjectID();
const users = [
  {
    "_id":userOneId,
    "email":"sunil@gmail.com",
    "password":"123Abc!",
    "tokens":[
      {
        access:"auth",
        token:jwt.sign({_id:userOneId.toHexString(),access:"auth"},"123abc").toString()
      }
    ]
  },
  {
    "_id":userTwoId,
    "email":"sunil2@gmail.com",
    "password":"1234Abc!"
  }
]

populateUsers = (done)=>{
  User.remove({}).then(()=>{
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      Promise.all([userOne,userTwo]);
  }).then(()=>done())
}
module.exports = {todos, populateTodos, users, populateUsers}
