const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
const userController = require('../Controller/userController');
const checkAuth = require('../middleware/auth')
var jwt = require('jsonwebtoken');

router.get('/',checkAuth,userController.getAlluser)

router.get('/createuser', (req, res) => {
    res.render('Createuser');
})

router.post('/createuser', userController.addUser);

router.get('/admin',(req, res) => {
    // res.status(200).json({message:"all done"});
    res.render('Admin');
})

router.get('/logout', async (req, res) => {
    req.cookies.jwt = "";
    console.log("le ho gya shyad" + req.cookies.jwt);
    res.render('login');
})

router.get('/login', (req, res) => {
    res.render('Login');
})



router.get('/edit/:sn', (req, res) => {
    var id = req.params.sn;
    res.render('Edit',{val:id});
})

router.post('/edit/:sn', userController.updateUser);

router.post('/login', userController.loginUser);

router.get('/edit/:sn',(req,res) => {
    res.render('Edit');
});

router.get('/:sn',userController.deleteUser);




module.exports = router;




// router.get('/searchuser', (req, res) => {
//     res.render('searchUser');
// })

// router.get('/register', (req, res) => {
//     res.render('Register');
// })

// // router.post('/register', (req, res) => {
        
// // })

// router.get('/login', (req, res) => {
//     res.render('login');
// })
