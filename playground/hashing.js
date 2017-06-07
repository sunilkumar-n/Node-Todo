const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

var data={
  id:4
}
var token = jwt.sign(data,"myappsecrect");
console.log(token);

var decoded = jwt.verify(token,"myappsecrect");
console.log(decoded);
//jwt.verify

// var enStr = SHA256("sunil kumar");
// console.log("encryped",enStr.toString());

//
// var datafromSever = {
//   a:4
// }
//
// var withSecret = SHA256(JSON.stringify(datafromSever)+"some secrect").toString();
//
// datafromSever.a = 4;
//
// var modified =  SHA256(JSON.stringify(datafromSever)+"some secrect").toString();
//
// if(withSecret === modified){
//   console.log("data not modified")
// }else{
//   console.log("data modified")
// }

//console.log(withSecret.toString());
