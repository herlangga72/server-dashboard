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
const promisePool = pool.promise()

app .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true })
)

app.post('/login/', function(request, respon){
    let uname=request.body.uname
    pool.query("SELECT pass FROM login WHERE uname='"+uname+"'" , 
        function(err, rows, fields) {
            if (rows[0].pass===request.body.pass){
                respon.send()
            }
            else{
                // respone code error password and error username
            }
        }
    )
})

async function getUserData(dataSize, startingId, Search){
    let SQL = "SELECT Id,uname,AccessLevel FROM login"
    console.log("StartingID "+startingId)
    console.log("dataSize "+ dataSize)
    if (dataSize != null && startingId != null){
        SQL = SQL + " WHERE Id>="+startingId+" LIMIT "+ dataSize
    }
    let [rows] = await promisePool.query(SQL)
    return rows
}
app.post('/User/TotalData',async function(request,respon){
    let [rows] = await promisePool.query("SELECT Value FROM information WHERE Name='login'")
    respon.send(rows)
}
)
// app.post('/User/Data',async function(request, respon){
//     respon.header('Content-Type', 'application/json');
//     let test=[]
//     await getUserData(dataSize=5,startingId=1).then(baris => baris.forEach(rows => test.push({id:rows.Id,uname:rows.uname,accessLevel:rows.AccessLevel})))
//     respon.send(test)
// })

app.post('/User/Data',async function(request, respon){
    //support pagination
    let startingId = request.body.id
    let dataSize   = request.body.Size
    console.log("before "+request.body.Size);
    respon.header('Content-Type', 'application/json');
    let test=[]
    await getUserData(dataSize,startingId).then(baris => baris.forEach(rows => test.push({id:rows.Id,uname:rows.uname,accessLevel:rows.AccessLevel})))
    console.log(test);
    respon.send(test)
})

app.listen(2000)