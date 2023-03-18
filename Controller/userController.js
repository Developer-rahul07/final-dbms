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
           
            if (row.password === password) {
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
                    res.render("Admin",{token:token});
                    // res.status(200).json({message:"ok",token:token})
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
exports.loginUser = loginUser;
exports.getAlluser = getAlluser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;



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