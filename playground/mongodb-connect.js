const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
  if(err){
    return console.log("Unable to connect to mongo server");
  }

  console.log("Connection Successful");

  // db.collection("Todos").insertOne({
  //   text:"This is my first Todo item",
  //   completed:false
  // },(err,result)=>{
  //   if(err)
  //     return console.log("Unable to insert Todo item");
  //
  //     console.log(JSON.stringify(result.ops, undefined, 2));
  // })

//user todo collection
  db.collection("Users").insertOne({
    name:"Kumar",
    age:25,
    location:"Bengaluru"
  },(err,result)=>{
      if(err)
        return console.log("unable to insert user to Users collection");

        console.log(JSON.stringify(result.ops, undefined, 2));
  })
  db.close();
})
