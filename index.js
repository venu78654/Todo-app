const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
// const editTodoItem = require('./public/edit');
const deleteTodoItem = require('./public/delete');


const app = express();
const port = 3000;

const url = "mongodb+srv://dcm-appuser:123qwerty123@cluster0.tgm5gkv.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'todo-app';

function idpassword(req,res,next){
    res.set('www-Authenticate','Basic realm="sample app"')
    if(req.headers.authorization == 'Basic dXNlcmlkOnBhc3Njb2Rl'){
        next()   
    }else{
        res.status(401).send("Please povide a id and password. You should login to Access the App")
    }
}



app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Connect to the MongoDB server
client.connect(function (err) {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  } 

  console.log('Connected successfully to server');

  const db = client.db(dbName);
  app.listen(port);

  app.post('/createitem', function (req, res) {
    db.collection('data').insertOne({ text: req.body.item }, function () {
      res.redirect('/');
    });
  });

  app.get('/',idpassword, function (req, res) {
    db.collection('data').find().toArray(function (err, items) {
      res.send(`
        
        <head>
          <link href="./style.css" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <div class="headcontainer">
              <h1 class="heading">TO-DO APP</h1>
            </div>
            <div class="formdiv">
              <form action="/createitem" method="POST">
                <input autofocus autocomplete="off" pleceholder="Type any text" class="entereditem" name="item" type="text">
                <button class="subbtn" value="submit">Add New Item</button>
              </form>
            </div>
            <ul class="list">
              ${items.map(function (item) {
                  return `
                    <li class="listitems">
                        ${item.text}
                        <span class="sidebutton">
                          
                          <button data-id="${item._id}" class="Dbtn" onclick="deleteitem(event)">Delete</button>
                        </span>
                      </li>
                    `;
                }).join('')}
            </ul>
          </div>
          <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
          <script src="./delete.js"></script>
        </body>
      `);
    });
  });

//   app.post('/update',function (req, res) {
//     const todoId = req.body.id;
//     const updatedData = {
//       text: req.body.text
//     };
//     console.log(todoId,updatedData)
//     db.collection('data').findOneAndUpdate({_id:new mongodb.ObjectId(todoId) },{$set:{updatedData}},function(err){
//         if(err){
//             console.error("error is:",err)
//             res.status(500).send('Error updating data');
//         } else {
//         res.send('Data updated');
//       }
//     })
//   });

app.post('/delete', function(req, res) {
    const todoId = req.body.id;
  
    db.collection('data').deleteOne({ _id: ObjectId(todoId) }, function(err, result) {
      if (err) {
        console.error('Error deleting todo item:', err);
        res.status(500).send('Error deleting todo item');
      } else {
        console.log('Todo item deleted successfully');
        res.send('Todo item deleted');
      }
    });
  });
 })
