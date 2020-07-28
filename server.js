`use strict`;
require('dotenv').config();
const express= require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const PORT= process.env.PORT ||3030;
const client = new pg.Client(process.env.DATABASE_URL);
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
 

 app.get('/', HomeHandler);
app.get('/fav',favHandler);
app.get('/detail/:detail_id',detailHandler);
// app.delete('/delete/:delete_id',deleteHandler);
app.post('/add',addHandler);

function addHandler(req,res){
    let {type,setup,punchline}=req.query;
    let sql = 'insert into jokes (type,setup,punchline) values ($1,$2,$3);
    let safevalues= [type,setup,punchline] ;
    client.query(sql,safevalues)
    .then(()=>{
        RTCIceCandidatePairChangedEvent('/favorite');
    })

}
// function deleteHandler(req,res){
//     let param= req.params.delete_id;
//     let sql = 
// }

function detailHandler(req,res){
    let sql = 'select * from jokes ;';
    client.query(sql)
    .then((result)=>{
        res.render('/detail',{data:result.rows});
    })
}


 function favHandler(req,res){
     let param= req.params.delete_id;
     let sql = 'select * from jokes WHERE id=$1;';
     let safeValues=[param]
     client.query(sql,safeValues)
     .then((result)=>{
         res.render('./fav',{data:result.rows[0]})
     })
 }




 function HomeHandler(req,res){
     let url = 'https://official-joke-api.appspot.com/jokes/programming/ten';
     console.log(url,"url");
     superagent.get(url)
     .then((data)=>{
         let newJoke= data.body;
            //  console.log(data.body,"ffffff");
 return new Joke(newJoke);
 
 res.render('./home',{Data:data.rows[0]});
})
console.log("data",data[0]);
     }
function Joke(newjoke){
    this.type = newjoke.type;
    this.setup = newjoke.setup;
    this.punchline= newjoke.punchline;


}

client.connect()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`listing to PORT ${PORT}`);
    })
})

