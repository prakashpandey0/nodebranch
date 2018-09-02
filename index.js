const express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var os = require('os');
var session = require('express-session');
var bcrypt = require('bcrypt');;
const app  =express();

app.use(session({secret: "session secret"}));
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

app.use(session({
  secret: "first node",
  resave: true,
  saveUninitialized: false
}));

app.get('/register',function(req,res){
  res.render('register',{title: "register"});
});

var regiterSchema = new Schema({
  email: {type:String, unique: true, required: true, trim: true},
  username: String,
  password: String,
  passwordConf: String
});

var Register = mongoose.model('regiterSchema', regiterSchema);

//remember
regiterSchema.pre('save',function(next){
  var register = this;
  bcrypt.hash(register.password,10,function(err, hash){
    if(err){
      console.log(err);
    }else{
      register.password = hash;
      next();
    }
  })
});
app.post('/register',function(req,res){
  var RegiterData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordConf: req.body.passwordConf
  }

  Register.create(RegiterData, function(err, success){
    if(err){
      console.log(err);
    }else{
      res.redirect('/');
    }
  })
});

app.get('/login',function(req, res){
  res.render('login',{title: "login"});
});
app.post('/login',function(req, res){
  var email = req.body.email;
  console.log(email);
  var password = req.body.password;

  Register.find({email: email}, function(err,success){
    if(err){console.log(err);}else{
      req.session.userid = success[0]._id;
      bcrypt.compare(password, success[0].password, function(err, result){
        if(result === true){
          res.redirect('/profile');
        }else{
          console.log(err);
        }
      })
    }
  })
});

app.get('/profile',function(req, res){
  if(req.session.userid){
    res.render('profile',{title:"profile"});
  }else{
    res.redirect('/');
  }

})

app.listen(3000,function(req, res){
  console.log("server started");
})
