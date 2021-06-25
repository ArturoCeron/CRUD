/*jshint esversion: 6 */

//Módulos
const { resolveSoa } = require('dns');
const express = require('express');
const path = require('path');
const Product = require('../models/product');
const expressSession = require('express-session');
const authMid = require('../middleware/authMiddleware');
const redirectIfAuth = require('../middleware/redirectIfAuth');

//Crear objeto router
const router = express.Router();

//Exportar router
module.exports = router;

//Activación de las sesiones (cookies)
router.use(expressSession({
    secret: 'ittgogalgos',
    resave: true,
    saveUninitialized: true
}));

// Variables Globales
router.use((req, res, next) =>{
    res.locals.loggedIn = req.session.userId || null;
    next();
});

//Página home
router.get('/', (req,res) =>{
    console.log(req.session);
    res.render('home');
});

//Insertar datos
router.get('/insertProduct', authMid, (req, res) =>{
    res.render('product');
});

// Consulta de datos
router.get('/api/product', authMid, ( req, res ) => {

    Product.find({}, (err, products) => {

        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });

        if (!products) return res.status(404).send({
            message: 'No existen productos'
        });

        //res.status(200).send({products});
        res.render('showproducts', {products});
    }).lean();
});

// Consulta por filtro -- CERON URIBE ARTURO 17211506
router.get('/api/product/:datoBusqueda', authMid, (req, res) =>{

    let datoBusqueda = req.params.datoBusqueda;
    Product.findById(datoBusqueda, (err, todoOK)=>{
    //Product.findOne({name: datoBusqueda}, (err, todoOK)=>{

        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });

        if (!todoOK) return res.status(404).send({
            message: 'El producto no existe'
        });
        //res.status(200).send({product: todoOK});
        res.render('editar', {products: todoOK});
    }).lean();

});

// Modificar Producto PUT
const putProduct = require('../controllers/putProduct');
router.put('/api/product/:productId', authMid, putProduct);

//Borrar un registro (Delete)
const delProduct = require('../controllers/delProduct');
router.delete('/api/product/:productId', authMid, delProduct);

//Inserción de datos
router.post('/api/product', authMid, ( req, res ) =>{

    let product = new Product();
    product.name = req.body.name;
    product.picture = req.body.avatar;
    product.price = req.body.price;
    product.category = (req.body.category).toLowerCase();
    product.description = req.body.description;

    console.log(req.body);

    product.save((err, productStored) =>{
        if (err) return res.status(500).send({
            message: `Error al realizar la petición ${err}`
        });

        //res.status(200).send({product: productStored});
        res.redirect('/api/product');
    })

});

//Metodo GET para logout
const logoutController = require('../controllers/logout');
router.get('/auth/logout', logoutController);

//Página login
const loginController = require('../controllers/login');
router.get('/auth/login', redirectIfAuth, loginController);

const loginUserController = require('../controllers/loginUser');
router.post('/users/login', redirectIfAuth, loginUserController);

//Pagina para registro de usuarios
const newUser = require('../controllers/newUser');
router.get('/users/register', redirectIfAuth, newUser);

//Post para el registro
const newUserController = require('../controllers/storeUser');
const { isBuffer } = require('util');
router.post('/auth/register', redirectIfAuth, newUserController);

//Página home
router.use((req,res) =>{
    res.render('notfound');
});