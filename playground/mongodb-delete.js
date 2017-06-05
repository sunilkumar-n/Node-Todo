const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
  if(err){
    return console.log("Unable to connect to mongo server");
  }

  console.log("Connection Successful");

  //deleteMany
  // db.collection("Todos").deleteMany({text:"Learning Mongo"}).then((result)=>{
  //   console.log(result);
  // })
  //deleteOne
  // db.collection("Todos").deleteOne({text:"Learning Mongo"}).then((result)=>{
  //   console.log(result);
  // })
  //findOneAndDelete
  // db.collection("Todos").findOneAndDelete({completed:true}).then((result)=>{
  //   console.log(result);
  // })

  db.collection("Users").findOneAndDelete({age:25}).then((result)=>{
    console.log(result);
  })

//  db.close();
})
