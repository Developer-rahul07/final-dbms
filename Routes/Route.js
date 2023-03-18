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

router.post('/createuser', userController.addUser)

router.get('/admin', (req, res) => {
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

router.post('/login', userController.loginUser);

router.get('/edit/:sn', (req, res) => {
    var id = req.params.sn;
    res.render('Edit',{val:id});
})

router.post('/edit/:sn', userController.updateUser);


router.get('/edit/:sn',(req,res) => {
    res.render('Edit');
});

router.get('/:sn',userController.deleteUser);



// router.get('/', (req, res) => {
//     res.render('Home');
// })
router.get('/',userController.Home)

// router.post('/', userController.Home)

// router.get('/home_1', (req, res) => {
//     res.render('Home_1');
// })

// router.post('/home_1', userController.home_1)

router.get('/home_1',userController.home_1)

// router.get('/pdfView',userController.pdfView)
router.get('/pdfView', (req, res) => {
    // res.render('pdfView',{pdfPaths : '../assets/pdf/ravi.pdf'});
    res.render('pdfView',{pdfPaths : '../assets/pdf/savi.pdf'});
})



// router.get('/table', (req, res) => {
//     res.render('tables');
// })

// router.post('/table', userController.table)

// router.get('/table', userController.table)







router.get('/list', (req, res) => {
    res.render('List');
})

router.post('/list', userController.listUser);

router.get('/pdfPath', (req, res) => {
    res.render('pdfPath');
})

router.post('/pdfPath', userController.pdfPath);

// router.get('/searchuser', (req, res) => {
//     res.render('searchUser');
// })

// router.get('/edituser', (req, res) => {
//     res.render('editUser');
// })

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


module.exports = router;
