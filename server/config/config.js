var env = process.env.NODE_ENV || "development";
env = env.trim();

if( env === "development" || env === "test"){
    var config = require("./config.json");
    var enConfig = config[env];
    Object.keys(enConfig).forEach((key)=>{
      process.env[key] = enConfig[key];
    })
}
