const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
  if(err){
    return console.log("Unable to connect to mongo server");
  }

  console.log("Connection Successful");
  //findOneAndUpdate

//   db.collection("Todos").findOneAndUpdate({
//     text:"Learning Mongo"
//   },
//   {
//     $set:{
//       text:"Learning the update operator"
//     }
//   },
//   {
//     returnOriginal:false
//   }
// ).then((result)=>{
//   console.log(result);
// })

  db.collection("Users").findOneAndUpdate({
    _id:new ObjectID("593508350d4ad936e4060320")
  },{
    $inc:{
      age:5
    }
  },{
     returnOriginal:false
  }).then((result) =>{
    console.log(result);
  })

//  db.close();
})
