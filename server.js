const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "fidelity-secret";

/* DATABASE */
const db = new sqlite3.Database("./fidelity.db");

/* CREATE TABLES */
db.serialize(() => {

db.run(`CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 email TEXT UNIQUE,
 password TEXT,
 name TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS wallet(
 userId INTEGER,
 balance INTEGER DEFAULT 0
)`);

});

/* SIGNUP */
app.post("/signup", async (req,res)=>{
 const {email,password,name} = req.body;

 const hash = await bcrypt.hash(password,10);

 db.run(
  "INSERT INTO users(email,password,name) VALUES(?,?,?)",
  [email,hash,name],
  function(err){
   if(err) return res.json({success:false,message:"User exists"});

   db.run("INSERT INTO wallet(userId) VALUES(?)",[this.lastID]);

   res.json({success:true});
  }
 );
});

/* LOGIN */
app.post("/login",(req,res)=>{
 const {email,password} = req.body;

 db.get("SELECT * FROM users WHERE email=?",[email],
 async(err,user)=>{

  if(!user) return res.json({success:false});

  const valid = await bcrypt.compare(password,user.password);
  if(!valid) return res.json({success:false});

  const token = jwt.sign({id:user.id},SECRET);

  res.json({success:true,token});
 });
});

app.listen(5000,()=>{
 console.log("✅ Backend running at http://localhost:5000");
});
