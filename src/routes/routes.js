const router = require('express').Router();
const passport = require('passport');
//controlador de productos
const productController = require('../controllers/product.controller');
//controlador de kardex
const kardexController = require('../controllers/kardex.controller');

router.get('/', (req, res, next) => {
    res.render('home');
});

router.get('/kardex', isAuthenticated, kardexController.getKardexs);

router.get('/addkardex', isAuthenticated, kardexController.getProducts);

router.post('/addkardex', isAuthenticated, kardexController.saveKardex);

router.get('/products', isAuthenticated, productController.getProducts);

router.get('/addproduct', isAuthenticated, (req, res, next) => {
    res.render('addproduct');
});

router.post('/addproduct', isAuthenticated, productController.saveProduct);

//editar producto
router.get('/editproduct/:id', isAuthenticated, productController.getProduct);
router.post('/editproduct/:id', isAuthenticated, productController.updateProduct);

//eliminar producto
router.get('/deleteproduct/:id', isAuthenticated, productController.deleteProduct);

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', (req, res, next) => {
    res.render('signin');
});


router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true
}));

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}

module.exports = router;
