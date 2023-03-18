// const sqlite3 = require('sqlite3').verbose();
// const express = require('express');


// let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
//     if (err && err.code == "SQLITE_CANTOPEN") {
//         return;
//     } else if (err) {
//         console.log("Getting error " + err);
//         exit(1);
//     }
// });

// function insertRow() {

    // db.run(`INSERT INTO mytable(name,empid,userid,password) VALUES(?,?,?,?)`, ['ram','ram32','gah','1234'], function (err) {
    //     if (err) {
    //         return console.log(err.message);
    //     }
    //     // get the last insert id
    //     console.log(`A row has been inserted `);
    // });

// }



// // addUser();

// // exports.addUser = addUser;
