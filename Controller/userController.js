const sqlite3 = require('sqlite3').verbose();
const express = require('express');


let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        return;
    } else if (err) {
        console.log("Getting error " + err);
        exit(1);
    }
});


const addUser = (req, res) => {
    console.log("checking  createuser----------------------11");
    var name = req.body.username;
    var empid = req.body.empid;
    var userid = req.body.userid;
    var password = req.body.password;
    console.log("checking  createuser----------------------22");

    db.run(`INSERT INTO mytable(name,empid,userid,password) VALUES(?,?,?,?)`, [name, empid, userid, password], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted `);
    });
    res.redirect('/login');
}

const table = (req, res) => {
    var list = req.query.list;
    var index = req.query.index;

    console.log("list is running-----------------------",list);
    console.log("index is running-----------------------",index);

    //for creating coloum inside list
    // db.run(`ALTER TABLE ${list} ADD ${index}`);

    //getting data from List table
    db.all(`SELECT * FROM List`, (error, row) => {
        if (error) {
            console.log("erorrrr in table--userController----",error);
        }
        // console.log("list row is-------",row);
        // res.render('tables',{values:row})

        db.all(`SELECT * FROM addIndex`, (error, addIndexData) => {
            if (error) {
                console.log("erorrrr in table--userController----",error);
            }
            // console.log("addIndex row is-------",addIndexData);

            let rowValues = {
                listData : row,
                indexData : addIndexData
            }


            res.render('tables',{recipes: rowValues})
    
        });
    });

        //getting data from addIndex table
    // db.all(`SELECT * FROM addIndex`, (error, addIndexData) => {
    //     if (error) {
    //         console.log("erorrrr in table--userController----",error);
    //     }
    //     console.log("addIndex row is-------",addIndexData);
    //     res.render('tables',{indexs:addIndexData})

    // });

}

const Home = (req, res) => {
    console.log("Home is==================-------");
    // const value = req.query.name;
    // console.log("home name value is-------",value);

    //getting data from List table
    db.all(`SELECT * FROM List`, (error, rows) => {
        if (error) {
            console.log("erorrrr in table--userController----",error);
        }
        console.log("list row is-------",rows);
        res.render('Home', { homes:rows })
    });
}

const home_1 = (req, res) => {

    const indexName = req.query.name;
    console.log("home_1 hi hu name value is-------",indexName);

    //getting data from List table
    db.all(`SELECT * FROM ${indexName}`, (error, row) => {
    // db.all(`SELECT * FROM ${indexName} WHERE SRNO = 1`,[indexName], (error, row) => {
    // db.all(`SELECT * FROM indexvalue`, (error, row) => {
        if (error) {
            console.log("erorrrr in table--userController----",error);
        }
        console.log("home_1 row is-------",row);
        res.render('Home_1',{home_1:row})

    });
}

const pdfView = (req, res) => {

    res.render('pdfView', { pdf: '../assets/pdf/ravi.pdf' });
}


const loginUser = (req, res) => {
    var name = req.body.username;
    var password = req.body.password;

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

            if (row.password === password) {
                console.log("user Logged in")
                res.redirect('/');
            }
            else {
                errors.push({ msg: 'Invalid Password' })
                res.render('Login', {
                    errors, name
                })
            }
        })
    }
}


const deleteUser = async (req,res,next) => {
    const id = req.params.id;
}

const getAlluser = async (req,res) => {
    db.all("SELECT * FROM mytable", function(err, rows) {
        res.render('Alluser', {data:rows})
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
        console.log("object is --------------", object);
        console.log("object is --------------", object.name == name);

        if(object.name == name){
        console.log("inside if-----");
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







exports.Home = Home;
exports.home_1 = home_1;
exports.pdfView = pdfView;
exports.addUser = addUser;
exports.loginUser = loginUser;
exports.deleteUser = deleteUser;
exports.getAlluser = getAlluser;
exports.listUser = listUser;
exports.pdfPath = pdfPath;
exports.table = table;



// db.each(`SELECT * FROM mytable WHERE name = ? `, name, (err, row) => {

//     if(row.name != name ){
//         console.log("user nahi h");
//         errors.push({ msg: 'User not registered'})
//         res.render('Login', {
//             errors
//         })
//     }
//     else{
//         if (row.password === password) {
//             console.log("user Logged in")
//             res.redirect('/');
//         }
//         else {
//             errors.push({ msg: 'Invalid Password'})
//             res.render('Login', {
//                 errors,name
//             })
//         }
//     }
// })