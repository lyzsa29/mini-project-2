import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
const app = express();

//auto convert text to json if possible
app.use(express.json());
//alow other origin to access our backend
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'lyssa',
  password: 'lilialimos09',
  database: 'barangay_capayang'
});
// const express = require('express')


//POST   - create a data from the server or database
//GET    - get    a data from the server or database
//PATCH  - update a data from the server or database
//DELETE - delete a data from the server or database


//login api, this is to use the request payload/body
//check if the payload username nad password match a data from the database
app.post('/login', function (request, response) {
    //request is the data from the frontend
    //response is the function or data from the server or backend
    const username = request.body.username;
    const password = request.body.password;

    console.log('username: ', username);
    console.log('password: ', password);

    //mysql query to fetch the username and password from the database using the payload from
    //the front end.
    const myQuery = `SELECT * FROM first_database.users
    where username = "${username}"`;
    //in short select user from database where username = payload.username and password = payload.password
  
    connection.query(myQuery, function (err, result) {
      if (err) throw err; //pagnagka error, mag crash
      //check result from our query to the database
      console.log("id result from database: ", result);
      if(result && result[0] && result[0].id){
        const hashedPassword = result[0].password;
                                        // password          , $2b$10etc......
        console.log('password from frontend: ', password);
        console.log('hashedPassword: ', hashedPassword);
        const check = bcrypt.compareSync(password, hashedPassword);

        
      const testCheck = bcrypt.compareSync(password, hashedPassword.toString());
      console.log('testCheck: ', testCheck);

        bcrypt.compare(password, hashedPassword, function(error, result){
          console.log('check result password: ', result);
          console.log('check result password: ', result);
        })

        console.log('check password: ', check);
        response.send({"success": true})
      }else{
        response.send({"success": false, "error": "invalid credentials"})
      }
    });
    
    
})

app.post('/register', function (request, response) {
    const username = request.body.username;
    const password = request.body.password;

    console.log('username: ', username);
    console.log('password: ', password);

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const myQuery = `INSERT INTO first_database.users (username, password) VALUES 
      ("${username}", "${hash}")`;

      console.log('hash: ', hash);

      const testCheck = bcrypt.compareSync(password, hash);
      console.log('testCheck: ', testCheck);
      connection.query(myQuery, function (err, result) {
        if (err) throw err; //pagnagka error, mag crash
            //check result from our query to the database
            console.log("id result from database: ", result);
        });
    response.send({"success": true})
})

console.log('STARTING EXPRESS SERVER')
connection.connect(function(error) {
    if (error) throw error; // nagka error, mag crash yung server
    //once successfully connected to the database, run express server
    console.log('MYSQL DB CONNECTION SUCCESS!')
    app.listen(3000)
    console.log('App is now running on port: ', 3000)
});