const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
  if(err){
    return console.log("Unable to connect to mongo server");
  }

  console.log("Connection Successful");

  // db.collection("Todos").find({_id:new ObjectID("5935078e143ad53584ffb48b")}).toArray().then((docs)=>{
  //   console.log(JSON.stringify(docs, undefined, 2));
  // },(err)=>{
  //   console.log("unable to fetch documents from Todos", err);
  // })

  db.collection("Users").find({name:"Sunil"}).toArray().then((docs)=>{
    console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
    console.log("Unable to fetch users"+err);
  })
//  db.close();
})
