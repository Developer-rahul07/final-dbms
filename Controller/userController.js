const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cookieParser = require("cookie-parser");
var jwt = require('jsonwebtoken');


let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        return;
    } else if (err) {
        console.log("Getting error " + err);
        exit(1);
    }
});


const addUser = (req, res) => {
    var name = req.body.username;
    var empid = req.body.empid;
    var userid = req.body.userid;
    var password = req.body.password;
    var cUser = req.body.createUser;
    var dUser = req.body.deleteUser;
    var upload = req.body.upload;
    var indexpdf = req.body.indexpdf;
    var exclRep = req.body.exclRep;
    var editpdf = req.body.editpdf;
    var delpdf = req.body.delpdf;

    if (cUser != '1') {
        cUser = "0";
    }
    if (dUser != '1') {
        dUser = "0";
    }
    if (upload != '1') {
        upload = "0";
    }
    if (indexpdf != '1') {
        indexpdf = "0";
    }
    if (exclRep != '1') {
        exclRep = "0";
    }
    if (editpdf != '1') {
        editpdf = "0";
    }
    if (delpdf != '1') {
        delpdf = "0";
    }

    db.run(`INSERT INTO mytable(name,empid,userid,password,cUser,dUser,upload,indexpdf,exclRep,editpdf,delpdf,delpdf) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`, [name, empid, userid, password, cUser, dUser, upload, indexpdf, exclRep, editpdf, delpdf, delpdf], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted `);
    });
    res.redirect('/login');
}

// const table = (req, res) => {
//     var list = req.query.list;
//     var index = req.query.index;

//     console.log("list is running-----------------------",list);
//     console.log("index is running-----------------------",index);

//     //for creating coloum inside list
//     // db.run(`ALTER TABLE ${list} ADD ${index}`);

//     //getting data from List table
//     db.all(`SELECT * FROM List`, (error, row) => {
//         if (error) {
//             console.log("erorrrr in table--userController----",error);
//         }
//         // console.log("list row is-------",row);
//         // res.render('tables',{values:row})

//         db.all(`SELECT * FROM addIndex`, (error, addIndexData) => {
//             if (error) {
//                 console.log("erorrrr in table--userController----",error);
//             }
//             // console.log("addIndex row is-------",addIndexData);

//             let rowValues = {
//                 listData : row,
//                 indexData : addIndexData
//             }


//             res.render('tables',{recipes: rowValues})
    
//         });
//     });
// }


const Home = (req, res) => {
    // console.log("Home is==================-------");
    // const value = req.query.name;
    // console.log("home name value is-------",value);

    //getting data from List table
    db.all(`SELECT * FROM List`, (error, rows) => {
        if (error) {
            console.log("erorrrr in table--userController----",error);
        }
        console.log("list row is-------",rows);
        res.render('Home', { homes : rows })
    });
}

const listviewpage = (req, res) => {

    const indexName = req.query.name;
    console.log("listviewpage hi hu name value is-------",indexName);

    //getting data from List table
    db.all(`SELECT * FROM ${indexName}`, (error, row) => {
    // db.all(`SELECT * FROM ${indexName} WHERE SRNO = 1`,[indexName], (error, row) => {
    // db.all(`SELECT * FROM indexvalue`, (error, row) => {
        if (error) {
            console.log("erorrrr in table--userController----",error);
        }
        console.log("listviewpage row is-------",row);
        res.render('listviewpage',{listviewpage:row})

    });
}

const deleteExcelRow = (req, res) => {

    // const indexName = req.query.name;
    const id = req.params.SRNO;
    // console.log("deleteExcelRow hi hu name value is-------",indexName);

    //getting data from List table
    // db.all(`DELETE FROM ${indexName} WHERE SRNO = ?`, [id], (error, row) => {
    db.all(`DELETE FROM indexvalue WHERE SRNO = ?`, [id], (error, row) => {
 
        if (error) {
            console.log("erorrrr in table--userController----",error);
        }
        console.log("excel row is deleted...");
        // res.redirect('/')
        // res.send(`Row ${id} is deleted successfullly!`)

    });
}

const pdfView = (req, res) => {

    res.render('pdfView', { pdf: '../assets/pdf/ravi.pdf' });
}


const loginUser = (req, res) => {

    var name = req.body.username;
    var password = req.body.password;

    console.log(name + " " + password);

    let errors = [];

    if (!name || !password) {
        errors.push({ msg: 'please fill the all fields' });
    }

    if (errors.length > 0) {
        res.render('Login', {
            errors, name, password
        })
    }
    else {
        db.each(`SELECT * FROM mytable WHERE name = ? `, name, (err, row) => {
           
            if (row.password === password && row.name === name ) {
                console.log("user Logged in");
                var token = jwt.sign(
                    {
                       name:row.name,
                       empid:row.empid
                    }, 
                    'secret',
                    {
                        expiresIn:"1h"
                    })
            
                    console.log(token);
                    res.cookie('jwt',token, { httpOnly: true, secure: true, maxAge: 3600000 })
                    res.render("welcomepage",{token:token});
                    // res.status(200).json({message:"ok",token:token})
            }
            else {
                errors.push({ msg: 'Invalid Credentials!' })
                res.render('Login', {
                    errors, name
                })
            }
        })
    }
}


const deleteUser = (req, res) => {

    const id = req.params.sn;

    db.run(`DELETE FROM mytable WHERE sn = ?`, [id], function (error) {
        if (error) {
            return console.error(error.message);
        }
        res.render('Admin');
    });

}


const getAlluser = async (req, res, next) => {
    db.all("SELECT * FROM mytable", function (err, rows) {
        if (err) {
            console.log(err);
        }
        // console.log(rows);
        res.render('Alluser', {data:rows})
        // res.status(200).json(rows);
    });
}


const deleteList = async (req, res, next) => {
    db.all("SELECT * FROM List", function (err, rows) {
        if (err) {
            console.log(err);
        }
        // console.log(rows);
        res.render('deleteList', {listData:rows})
    });
}


const deleteListSerialNumber = (req, res) => {

    const id = req.params.sn;
    console.log("deleteListSerialNumber id is---------",id);


   
    db.each(`SELECT * FROM List WHERE sn = ?`,[id], (error, row) => {
        if (error) {
            console.log("deleteListSerialNumber error-------------",error);
        }
        console.log("deleteListSerialNumber select One-----",row);

        // `DROP TABLE row.name`;
        // db.run(`DROP TABLE  ?`, [row.name]);

      
        
    });
    
    
    
    
    db.run(`DELETE FROM List WHERE sn = ?`, [id], function (error) {
        if (error) {
            return console.error(error.message);
        }
        // res.render('deleteList');
        console.log("deleteListSerialNumber list is deleted-----");
    });
    
}


// code for list 

const listUser = (req, res) => {
    var name = req.body.username;

    let errors = [];

    if (!name) {
        errors.push({ msg: 'please fill the field' });
    }

    if (errors.length > 0) {
        res.render('List', {
            errors, name
        })
    }
    else {

    db.run("CREATE TABLE IF NOT EXISTS List (sn INTEGER PRIMARY KEY, name TEXT)");

        
    db.all(`SELECT * FROM List WHERE name = ?`,name, (error, row,) => {
        console.log("row======================================",row );


        let object = Object.assign({}, ...row)
        // console.log("object is --------------", object);
        // console.log("object is --------------", object.name == name);

        if(object.name == name){
        // console.log("inside if-----");
        //make alert section
        res.redirect('/list')
        
        }
    else{
            console.log("insde else---------------------------------");     
            db.run(
              `INSERT INTO List (name) VALUES (?)`,
              [name],
              function (error) {
              if (error) {
                  console.error(error.message);
              }
              console.log(`Inserted a row with the ID: ${this.lastID}`);
              }
          );  


            db.exec(`
            CREATE TABLE ${name}
            (
              ID INTEGER PRIMARY KEY AUTOINCREMENT
            );
          `
          );

        }

  });
    }
}



const pdfPath = (req, res) => {
    var name = req.body.username;

    let errors = [];

    if (!name) {
        errors.push({ msg: 'please fill the field' });
    }

    if (errors.length > 0) {
        res.render('addIndex', {
            errors, name
        })
    }
    else {

    db.run("CREATE TABLE IF NOT EXISTS addPath (sn INTEGER PRIMARY KEY, path TEXT)");



  db.run(
    `UPDATE addPath SET path = ? WHERE sn = ?`,
    [name, 1],
    function (error) {
      if (error) {
        console.error(error.message);
      }
      console.log(`Row has been updated`);
    }
  );


        
    // db.all(`SELECT * FROM addIndex WHERE name = ?`,name, (error, row,) => {
    //     console.log("row=============addIndex=========================",row );


    //     let object = Object.assign({}, ...row)
    //     console.log("object is --------------", object);
    //     console.log("object is --------------", object.name == name);

    //     if(object.name == name){
    //     console.log("inside if----addIndex-");
    //     //make alert section
    //     res.redirect('/userindex')
        
        }
    // else{
    //         console.log("insde else-------------addIndex--------------------");     
    //         db.run(
    //           `INSERT INTO addIndex (name) VALUES (?)`,
    //           [name],
    //           function (error) {
    //           if (error) {
    //               console.error(error.message);
    //           }
    //           console.log(`Inserted a row with addIndex the ID: ${this.lastID}`);
    //           }
    //       );  

    //     }

 
}


const updateUser = (req, res) => {
    const sn = req.params.sn;
    var name = req.body.username;
    var empid = req.body.empid;
    var userid = req.body.userid;
    var password = req.body.password;
    var cUser = req.body.createUser;
    var dUser = req.body.deleteUser;
    var upload = req.body.upload;
    var indexpdf = req.body.indexpdf;
    var exclRep = req.body.exclRep;
    var editpdf = req.body.editpdf;
    var delpdf = req.body.delpdf;

    if (cUser != '1') {
        cUser = "0";
    }
    if (dUser != '1') {
        dUser = "0";
    }
    if (upload != '1') {
        upload = "0";
    }
    if (indexpdf != '1') {
        indexpdf = "0";
    }
    if (exclRep != '1') {
        exclRep = "0";
    }
    if (editpdf != '1') {
        editpdf = "0";
    }
    if (delpdf != '1') {
        delpdf = "0";
    }

    db.run(
        `UPDATE mytable SET name = ?, empid = ?, userid = ?, password = ?, cUser = ?, dUser = ?,upload = ?,indexpdf = ?,exclRep = ?,editpdf = ?,delpdf = ? WHERE sn = ?`,
        [name, empid, userid, password, cUser, dUser, upload, indexpdf, exclRep, editpdf, delpdf, sn],
        function (error) {
            if (error) {
                console.error(error.message);
            }
        }
    );
    res.render('Admin');
}






exports.addUser = addUser;
exports.Home = Home;
exports.listviewpage = listviewpage;
exports.deleteExcelRow = deleteExcelRow;
exports.pdfView = pdfView;
exports.loginUser = loginUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getAlluser = getAlluser;
exports.deleteList = deleteList;
exports.deleteListSerialNumber = deleteListSerialNumber;
exports.listUser = listUser;
exports.pdfPath = pdfPath;
// exports.table = table;



