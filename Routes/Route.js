const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
const userController = require('../Controller/userController');
const checkAuth = require('../middleware/auth')
var jwt = require('jsonwebtoken');



router.get('/index/:SRNO', checkAuth ,userController.deleteExcelRow)

router.get('/list',checkAuth, (req, res) => {
    res.render('List');
})

router.post('/list', userController.listUser);

router.get('/pdfPath', checkAuth, (req, res) => {
    res.render('pdfPath');
})

router.post('/pdfPath', userController.pdfPath);



// router.get('/', (req, res) => {
    // res.render('Home');
// })
router.get('/', checkAuth ,userController.Home)

// router.post('/', checkAuth, userController.Home)

// router.get('/home_1', (req, res) => {
//     res.render('Home_1');
// })

// router.post('/home_1', userController.home_1)

router.get('/listviewpage',checkAuth,userController.listviewpage)

// router.get('/pdfView',userController.pdfView)
router.get('/pdfView',checkAuth, (req, res) => {
    // res.render('pdfView',{pdfPaths : '../assets/pdf/ravi.pdf'});
    res.render('pdfView',{pdfPaths : '../assets/pdf/savi.pdf'});
})



// need to change url path
router.get('/delete&update',checkAuth,userController.getAlluser)


router.get('/createuser', checkAuth, (req, res) => {
    res.render('Createuser');
})

router.post('/createuser', userController.addUser)

router.get('/admin',checkAuth, (req, res) => {
    res.render('Admin');
})

router.get('/logout', async (req, res) => {
    req.cookies.jwt = "";
    console.log("le ho gya shyad logout" + req.cookies.jwt);
    res.render('login');
})

router.get('/login', (req, res) => {
    res.render('Login');
})

router.post('/login', userController.loginUser);

router.get('/edit/:sn',checkAuth, (req, res) => {
    var id = req.params.sn;
    res.render('Edit',{val:id});
})

router.post('/edit/:sn', userController.updateUser);


router.get('/edit/:sn',checkAuth, (req,res) => {
    res.render('Edit');
});

router.get('/:sn',checkAuth,userController.deleteUser);




// router.get('/table', (req, res) => {
//     res.render('tables');
// })

// router.post('/table', userController.table)

// router.get('/table', userController.table)








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
