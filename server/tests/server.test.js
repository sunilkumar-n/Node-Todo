const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/Todo");
const {User} = require("./../models/User");
const {ObjectID} = require("mongodb");
const {todos, populateTodos, users, populateUsers} =require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos",()=>{
  it("should insert a text to mongoose database",(done)=>{
    var text = "text from server.test file";

      request(app)
      .post("/todos")
      .set("x-auth",users[0].tokens[0].token)
      .send({text,creator:users[0]._id})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text)
      })
      .end((err,res)=>{
        if(err)
          return done(err);

        Todo.find({text}).then((result)=>{
          expect(result.length).toBe(1);
          expect(result[0].text).toBe(text);
          done();
        }).catch((e)=> done(e))
      })
  })

  it("should not a create a todo for invalid parameters!",(done)=>{
      var text="";
      request(app)
      .post("/todos")
      .set("x-auth",users[0].tokens[0].token)
      .send({text})
      .expect(400)
      .end((err,res)=>{
        if(err)
          return done(err);
         Todo.find({creator:users[0]._id}).then((result)=>{
           expect(result.length).toBe(1);
           done();
         }).catch((e)=>done(e))

      })

  })

})

describe("GET /todos",()=>{
  it("should return all the todos from database",(done)=>{
      request(app)
      .get("/todos")
      .set("x-auth",users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(1)
      })
      .end(done)
  })
})

describe("GET /todos/:id",()=>{
  it("should return valid todo object",(done)=>{
      request(app)
      .get(`/todos/${todos[0]._id}`)
      .set("x-auth",users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it("should return 404 status if todo not found",(done)=>{
    var id = todos[0]._id;
    request(app)
    .get(`/todos/${id+1}`)
    .set("x-auth",users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })
  it("should return error if the id is not valid",(done)=>{
    request(app)
    .get("/todos/123")
    .set("x-auth",users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })
})

describe("DELETE /todos/:id",()=>{
  it("should delete an todo object",(done)=>{
      request(app)
      .delete(`/todos/${todos[0]._id}`)
        .set("x-auth",users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end((err,res)=>{
        if(err)
          return done(err)

          Todo.findById(todos[0]._id).then((todo)=>{
            expect(todo).toNotExist();
            done();
          }).catch((e)=> done(e));
      })
  })

  it("should give me 404 for id not found ",(done)=>{
    var id = todos[0]._id;
      request(app)
      .delete(`/todos/${id+1}`)
      .set("x-auth",users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it("should give me 404 for id is not valid ",(done)=>{
      request(app)
      .delete(`/todos/123`)
      .set("x-auth",users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
})

describe("PATCH /todos/:id",()=>{
    it("should set completedat when completed is true",(done)=>{
        var id = todos[1]._id;
        var text = "this is updated text";
        request(app)
        .patch(`/todos/${id}`)
        .set("x-auth",users[1].tokens[0].token)
        .send({completed:true,text})
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo.completedAt).toBeA('number');
        expect(res.body.todo.text).toBe(text);
        })
        .end(done)
    })

    it("should set completedAt to null when completed is false",(done)=>{
      var id = todos[0]._id;
        request(app)
        .patch(`/todos/${id}`)
        .set("x-auth",users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo.completedAt).toBe(null)
        })
        .end(done)
    })
})

//test cases for users
describe("GET /users/me",()=>{
  it("should return an valid user when passed with valid token",(done)=>{
      request(app)
      .get("/users/me")
      .set("x-auth",users[0].tokens[0].token)
      .expect(200)
      .expect((res) =>{
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  })

  it("should return an 401 response when token is empty",(done)=>{
      request(app)
      .get("/users/me")
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done)
  })
})

describe("POST /users",()=>{
    it("should create a new user ",(done)=>{
        request(app)
        .post("/users")
        .send({email:"suniltest@example.com",password:"pass123"})
        .expect(200)
        .expect((res)=>{
            expect(res.body.email).toBe("suniltest@example.com");
            expect(res.header["x-auth"]).toExist();
        })
        .end((err)=>{
            if(err)
              return done(err);
              User.findOne({email:"suniltest@example.com"}).then((user)=>{
                  expect(user._id).toExist();
                  expect(user.password).toNotEqual("pass123")
                  done();
                }).catch ((err)=>{
                  done(err);
                })
        })
    })

    it("should validate and return validation error if invalid",(done)=>{
        request(app)
        .post("/users")
        .send({email:"myemail",password:"123"})
        .expect(400)
        .end(done)
    })

    it("should not create a user with same email",(done)=>{
        request(app)
        .post("/users")
        .send(users[0])
        .expect(400)
        .end(done)

    })
})

describe("POST /users/login",()=>{
    it("should return a valid token, if user exist",(done)=>{
        request(app)
        .post("/users/login")
        .send({email:users[0].email,password:users[0].password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers["x-auth"]).toExist();
            expect(res.body.email).toBe(users[0].email)
        })
        .end(done)
    })

    it("should return 400 if user doesnt exist",(done)=>{
      request(app)
      .post("/users/login")
      .send({email:"someemail@example.com",password:users[0].password})
      .expect(400)
      .expect((res)=>{
          expect(res.body).toEqual({});
      })
      .end(done)
    })
})

describe("DELETE /users/me/token",()=>{
    it("should delete a token of user",(done)=>{
      request(app)
      .delete("/users/me/token")
      .set("x-auth",users[0].tokens[0].token)
      .expect(200)
      .end((err,res)=>{
          if(err)
          return done(err)

          //find the user and expect tokens length 0
          User.findOne({email:users[0].email}).then((user)=>{
              if(!user)
              return done();
              expect(user.tokens.length).toBe(0);
              done()
          }).catch ((err)=>{
            done(err);
          })
      })
    })

    it("should give 401 for invalid token",(done)=>{
      request(app)
      .delete("/users/me/token")
      .set("x-auth","123")
      .expect(401)
      .end(done)
    })
})
