var env = process.env.NODE_ENV || "development";
env = env.trim();
if(env === "development"){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
}
 else if(env === "test"){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
}
