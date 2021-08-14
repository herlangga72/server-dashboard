var express = require('express')
var app = express()
const cors = require('cors')

//mysql block
// get the client
const mysql = require('mysql2')
 
// create the connection to database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'MyNewPass',
    database: 'system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })


app.use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true })
)

app.post('/login/', function(request, respon){
    let uname=request.body.uname
    pool.query("SELECT pass FROM login WHERE uname='"+uname+"'" , 
        function(err, rows, fields) {
            console.log(request.body);
            // { uname: 'herlangga', pass: '1' }
            if (rows[0].pass==request.body.pass){
                respon.send()
            }
            else{
                // respone code error password and error username
            }
        }
    )
})


app.post('/getdata/', function(request, respon){
    respon.header('Content-Type', 'application/json');
    var test=[]
    pool.query("SELECT Id,uname,AccessLevel FROM login", function(err, rows, fields) {
        //this used for make data separeate with unique id. this handle error on ibm component table
        rows.forEach(element => { 
            test.push({id:element.Id,uname:element.uname,accessLevel:element.AccessLevel})
        });
        console.log(test)
        respon.send(test)
    })
})

app.listen(2000)