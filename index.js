const mysql = require('mysql');  
const express = require('express');  
var app = express();  
const bodyparser = require('body-parser');  
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
app.use(bodyparser.json());  
  

var mysqlConnection = mysql.createConnection({  
    host: 'localhost',  
    user : 'root',  
    password : '',   
    database : 'meetingsdb',  
    multipleStatements : true  
});  
  
// connection check  
mysqlConnection.connect((err) => {  
    if(!err) {  
        console.log("Db Connection Succeed");  
    }  
    else{  
        console.log("Db connect Failed \n Error :" + JSON.stringify(err,undefined,2));  
    }  
});  
//adding swagger 
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
// port listen
app.listen(3000,()=> console.log("Express server is running at port no : 3000"));  
  
// CRUD Methods  
//Get all meetings  
app.get('/meetings',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM meetings',(err,rows,fields)=>{  
    if(!err)   {
        
        var end = Object.keys(rows).length-1;
        //need to fix time with 'moment' plugin
        for (let i = 0; i <= end; i++) {
            console.log(rows[i].startDate);
            var d = new Date(rows[i].startDate);
            var newd = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
            rows[i].startDate = newd;
            var d = new Date(rows[i].endDate);
            var newd = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
            rows[i].endDate = newd;
            
          }
          
    
    

    res.send(rows);
    }  
    else  
        console.log(err);  
      
})  
});  
  
//Get data for meeting by username
app.get('/meetings/:id',(req,res)=>{  
    mysqlConnection.query('SELECT * FROM meetings WHERE owner = ?',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    res.send(rows);  
    else  
        console.log(err);  
      
})  
});  


//Get row by username and date
app.get('/meetings/:owner/:startDate',(req,res)=>{  
    
    
    mysqlConnection.query("SELECT * FROM meetings WHERE owner = '"+req.params.owner+"' AND startDate = '"+req.params.startDate+"'",(err,rows,fields)=>{  
    if(!err)   
    
    res.send(rows);  
    else  
        console.log(err);  
      
})  
});  
  
//Delete meeting data by Id
app.delete('/meetings/:id',(req,res)=>{  
    
    mysqlConnection.query('DELETE FROM meetings WHERE id = ?',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    res.send("Data Deletion Successful");  
    else  
        console.log(err);  
      
})  
});  
  
  //Create a meeting  
app.post('/meeting',(req,res)=>{  
    let mtng = req.body;  
    var sql = "INSERT INTO meetings SET ?"  
    let post = {owner: mtng.owner ,
                title: mtng.title,
                startDate: mtng.startDate,
                startTime: mtng.startTime,
                endDate: mtng.endDate,
                endTime: mtng.endTime,
                roomNumber: mtng.roomNumber

    }
    var free=true;
    try {
        
        mysqlConnection.query('SELECT * FROM meetings WHERE startDate='+post.startDate,(err,rows,fields)=>{

            console.log(rows);
            if(!err)   {
              
                var end = Object.keys(rows).length-1;
                console.log(rows);
                for (let i = 0; i <= end; i++) {

                    if(post.roomNumber==rows[i].roomNumber && post.startTime<rows[i].endTime && post.endTime>rows[i].endTime)

                    free=false;

                    else console.log(err,"Extract failed ");  
               
                     }
        }
            else  
                console.log(err,"Extract failed ");  
        })
        console.log(rows);

        


        

        
    } 
    catch (error) {
        
    }
     
    mysqlConnection.query(sql,post,(err,rows,fields)=>{
        
        if(!err && free)   
        res.send("Insertion Completed");  
        else  
            console.log(err,"Insert failed ");  
    })  

});

//UPDATE a meeting  
app.put('/meetingsU',(req,res)=>{  
    let mtng = req.body;  
   
   
    var meetId = mtng.id
    let put = {
                
                title: mtng.title,
                startDate: mtng.startDate,
                startTime: mtng.startTime,
                endDate: mtng.endDate,
                endTime: mtng.endTime,
                roomNumber: mtng.roomNumber

    }
    console.log(put.roomNumber);
    var sql = "UPDATE meetings SET ?  WHERE id= "+meetId;
    
    
    
    mysqlConnection.query(sql,put,(err,rows,fields)=>{
    if(!err)   
    res.send("Update complete!");  
    else  
        console.log(err,"Insert failed ");  
})  
});
 

  
  
