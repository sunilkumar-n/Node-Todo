const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/Todo");

beforeEach((done) =>{
  Todo.remove({}).then(()=>done());
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

        Todo.find().then((result)=>{
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
           expect(result.length).toBe(0);
           done();
         }).catch((e)=>done(e))

      })

  })

})
