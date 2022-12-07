var Product=require('../models/product.model');

var controller={
    //metodo para guardar un producto
    saveProduct:function(req,res, done){
        var product=new Product();
        var params=req.body;

        product.nombre=params.nombre;
        product.precioVenta=params.precioVenta;
        product.descripcion=params.descripcion;
        product.categoria=params.categoria;

        //verificamos si el nombre del producto ya existe
        Product.findOne({nombre:product.nombre},function(err,productFound){
            if(err){
                done(null,false,req.flash('errorGuardarProducto','falla de servidor'));
                res.redirect('/addproduct');
            }
            if(productFound) {
                console.log("producto encontrado: "+productFound);
                done(null,false,req.flash('errorGuardarProducto','El nombre del producto ya existe'));
                res.redirect('/addproduct');
            }else{
                product.save((err,productStored)=>{
                    if(err){
                        done(null,false,req.flash('errorGuardarProducto','Error al guardar el producto, falla de servidor'));
                        res.redirect('/addproduct');
                    }
                    if(!productStored){
                        done(null,false,req.flash('errorGuardarProducto','No se ha podido guardar el producto'));
                        res.redirect('/addproduct');
                    }
                    done(null, false, req.flash('productoGuardado', 'Producto guardado correctamente'));
                    res.redirect('/addproduct');
                });
            }
            
        });
    },
    //metodo para obtener todos los productos
    getProducts:function(req,res, done){
        Product.find({}).exec((err,products)=>{
            if(err) {
                done(null,false,req.flash('errorMostrarProductos','Error al mostrar los productos, falla de servidor'));
                res.redirect('/products');
            }
            if(!products){
                done(null,false,req.flash('errorMostrarProductos','No hay productos para mostrar'));
                res.redirect('/products');
            }
            //le ponemos el nombre a cada producto para que se pueda mostrar en la vista
            var productosnombre=[];
            for(var i=0;i<products.length;i++){
                var producto={
                    nombre:products[i].nombre,
                    precioVenta:products[i].precioVenta,
                    descripcion:products[i].descripcion,
                    categoria:products[i].categoria,
                    id:products[i]._id
                }
                productosnombre.push(producto);
            }
            res.render('products',{productos: products, productosjson: JSON.stringify(productosnombre)});
        });
    },
    //metodo para obtener un producto por id
    getProduct:function(req,res, done){
        var productId=req.params.id;
        Product.findById(productId,(err,product)=>{
            if(err){
                done(null,false,req.flash('errorMostrarProducto','Error al mostrar el producto, falla de servidor'));
                res.redirect('/editproduct/'+productId);
            }
            if(!product){
                done(null,false,req.flash('errorMostrarProducto','No hay producto para mostrar'));
                res.redirect('/editproduct/'+productId);
            }
            res.render('editproduct',{product});
        });
    },
    //metodo para actualizar un producto
    updateProduct:function(req,res, done){
        const id=req.params.id;
        const update=req.body;
        var updateProduct={
            nombre:update.nombre,
            precioVenta:update.precioVenta,
            descripcion:update.descripcion,
            categoria:update.categoria
        };
        console.log("id del producto: "+id);
        console.log("producto a actualizar: "+updateProduct);
        Product.findByIdAndUpdate(id,updateProduct,(err,productUpdated)=>{
            if(err){
                done(null,false,req.flash('errorActualizarProducto','Error al actualizar el producto, falla de servidor'));
                res.redirect('/editproduct/'+id);
            }
            if(!productUpdated){
                done(null,false,req.flash('errorActualizarProducto','No se ha podido actualizar el producto'));
                res.redirect('/editproduct/'+id);
            }
            done(null, false, req.flash('productoActualizado', 'Producto actualizado correctamente'));
            res.redirect('/products');
        });
    },
    //metodo para eliminar un producto
    deleteProduct:function(req,res, done){
        var productId=req.params.id;
        Product.findByIdAndRemove(productId,(err,productRemoved)=>{
            if(err){
                done(null,false,req.flash('errorEliminarProducto','Error al eliminar el producto, falla de servidor'));
                res.redirect('/products');
            }
            if(!productRemoved){
                done(null,false,req.flash('errorEliminarProducto','No se ha podido eliminar el producto'));
                res.redirect('/products');
            }
            done(null, false, req.flash('productoEliminado', 'Producto eliminado correctamente'));
            res.redirect('/products');
        });
    },

};

module.exports=controller;