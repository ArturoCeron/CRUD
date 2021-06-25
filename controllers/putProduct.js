/*jshint esversion: 6 */

/* Arturo Ceron Uribe */

const Product = require('../models/product');

module.exports = (req, res)=>{
    
    let datoModificar = req.params.productId;
    let update = req.body;
    console.log(datoModificar);
    console.log(update);
    Product.findOneAndUpdate({_id: datoModificar}, update, (err, products) =>{
            if (err) return res.status(500).send({
                message: `Error al actualizar el producto ${err}`
            });
    
            if (!products) return res.status(404).send({
                message: 'El producto no existe'
            });
            //console.log(products);
            //res.status(200).send({product: products});
            res.redirect('/api/product');
    });
};