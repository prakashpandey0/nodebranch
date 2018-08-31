const express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var os = require('os');
const app  =express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
mongoose.connect('mongodb://127.0.0.1:27017/newdb');

var db = mongoose.connection;

db.on('error',console.error.bind(console,"connection error"));
var Schema = mongoose.Schema;
 nodeSchema = new Schema({
  name: String,
  age: String
});

 nodeSchemaModel = mongoose.model('nodeSchema', nodeSchema);


app.get('/',function(req, res){
  res.render('index',{title:"home", platform: os.platform(), architecture: os.arch()});
});

app.get('/create',function(req, res){
  res.render('create',{title: "CREATE"});
});

app.post('/create',function(req,res){
  nodeSchemaModel.create({name:req.body.fname, age: req.body.age},function(err,success){
    if(err){
      console.log(err);
    }else{
      res.redirect('/');
    }
  })

});

app.get('/show',function(req, res){

   nodeSchemaModel.find().select('_id name age').exec(function(err,success){
  res.render('show',{title: "show", users: success});
  })

})

app.get('/update/:uid',function(req,res){
  nodeSchemaModel.find().where({_id: req.params.uid}).exec(function(err,success){
    res.render('update',{title:"update", users: success});
    console.log(success);
  });
});
app.post('/update',function(req,res){
  console.log(req.body.id);
  nodeSchemaModel.updateOne(
   { _id: new mongodb.ObjectID(req.body.id) },
   { $set:
      {
        name: req.body.fname,
        age: req.body.age
      }
   },function(err,succes){
     if(err){
       console.log(error);
     }else{
       res.redirect('/');
     }
   }
)
console.log("success");
});
app.get('/delete/:uid',function(req,res){
  var uid = req.params.uid;
  nodeSchemaModel.deleteOne({_id: new mongodb.ObjectID(uid)}, function(err, success){
    if(err){
      console.log(err);
    }else{
      res.redirect('/show');
    }
  })

});


// var Schema = mongoose.Schema;
//
// var StudentSchema = new Schema({
//   name: String,
//   date: Date
// });
//
// var StudentModel = mongoose.model('StudentModel',StudentSchema);


//var stud = new StudentModel({name: "addd"});//var stud = new StudentModel({name: "prakash"})
// StudentModel.create({name: "akash"}, function(err, success){
//   if(err){
//     console.log(err);
//   }else{
//     console.log(success);
//   }
// })
// StudentModel.find({name: "akash"},function(error, success){
//   if(error) {
//     console.log(error)
//   }else{
//     console.log(success);
//   }
// })
// StudentModel.count({name:'akash'},function(err, count){
//   console.log(count);
// });
// stud.save(function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("data is saved for student");
//   }
// })

app.listen(3000,function(req, res){
  console.log("server started");
})
