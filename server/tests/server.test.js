const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/Todo");
const {ObjectID} = require("mongodb");

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
beforeEach((done) =>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos)
  }).then(() =>done());
});

describe("POST /todos",()=>{
  it("should insert a text to mongoose database",(done)=>{
    var text = "text from server.test file";

      request(app)
      .post("/todos")
      .send({text})
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
      .send({text})
      .expect(400)
      .end((err,res)=>{
        if(err)
          return done(err);
         Todo.find().then((result)=>{
           expect(result.length).toBe(2);
           done();
         }).catch((e)=>done(e))

      })

  })

})

describe("GET /todos",()=>{
  it("should return all the todos from database",(done)=>{
      request(app)
      .get("/todos")
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe("GET /todos/:id",()=>{
  it("should return valid todo object",(done)=>{
      request(app)
      .get(`/todos/${todos[0]._id}`)
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
    .expect(404)
    .end(done)
  })
  it("should return error if the id is not valid",(done)=>{
    request(app)
    .get("/todos/123")
    .expect(404)
    .end(done)
  })
})

describe("DELETE /todos/:id",()=>{
  it("should delete an todo object",(done)=>{
      request(app)
      .delete(`/todos/${todos[0]._id}`)
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
      .expect(404)
      .end(done)
  })

  it("should give me 404 for id is not valid ",(done)=>{
      request(app)
      .delete(`/todos/123`)
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
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo.completedAt).toBe(null)
        })
        .end(done)
    })
})
