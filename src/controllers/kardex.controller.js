var Product=require('../models/product.model');
var Kardex=require('../models/kardex.model');

var controller={
    //obtener lista de productos para el formulario de kardex
    getProducts:function(req,res, done){
        Product.find({},function(err,products){
            if(err) {
                done(null,false,req.flash('errorMostrarProductos','Error al mostrar los productos, falla de servidor'));
                res.redirect('/kardex');
            }
            if(!products) {
                done(null,false,req.flash('errorMostrarProductos','No hay productos para mostrar'));
                res.redirect('/kardex');
            }
            res.render('addkardex',{productos: products});
        });
    },
    //metodo para guardar un kardex
    saveKardex:function(req,res, done){
        var kardex=new Kardex();
        var params=req.body;
        console.log(params);
        kardex.fecha=params.fecha;
        kardex.operacion=params.operacion;
        kardex.producto=params.producto;
        kardex.cantidad=params.cantidad;
        kardex.precioUnitario=params.precioUnitario;
        kardex.precioTotal= kardex.calcularPrecioTotal();
        console.log(kardex);
        //verificamos si el stock es suficiente para la operacion de tipo Salida
        if(kardex.operacion=="Salida"){
            Kardex.find({producto:kardex.producto},function(err, kardexes){
                var stock=0;
                kardexes.forEach(function(kardex){
                    if(kardex.operacion=="Ingreso" && kardex.producto==kardex.producto){
                        stock+=kardex.cantidad;
                    }
                    if(kardex.operacion=="Salida" && kardex.producto==kardex.producto){
                        stock-=kardex.cantidad;
                    }
                });
                console.log("stock: "+stock);
                if(stock<kardex.cantidad){
                    done(null, false, req.flash('errorGuardarKardex','No hay stock suficiente para la operacion \n Stock actual: '+stock));
                    res.redirect('/addkardex');
                }else{
                    //verificamos si la fecha es mayor a la fecha actual
                    if(kardex.fecha>new Date()){
                        done(null, false, req.flash('errorGuardarKardex','La fecha no puede ser mayor a la fecha actual'));
                        res.redirect('/addkardex');
                    }else{
                        kardex.save((err,kardexStored)=>{
                            if(err) {
                                done(null,false,req.flash('errorGuardarKardex','Error al guardar el kardex, falla de servidor'));
                                res.redirect('/addkardex');
                            }
                            if(!kardexStored){
                                done(null,false,req.flash('errorGuardarKardex','No se ha podido guardar el kardex'));
                                res.redirect('/addkardex');
                            }
                            done(null, false, req.flash('kardexGuardado', 'Kardex guardado correctamente'));
                            res.redirect('/addkardex');
                        });
                    }
                }
            });
        }else{
            //verificamos si la fecha es mayor a la fecha actual
            if(kardex.fecha>new Date()){
                done(null, false, req.flash('errorGuardarKardex','La fecha no puede ser mayor a la fecha actual'));
                res.redirect('/addkardex');
            }else{
                kardex.save((err,kardexStored)=>{
                    if(err) {
                        done(null,false,req.flash('errorGuardarKardex','Error al guardar el kardex, falla de servidor'));
                        res.redirect('/addkardex');
                    }
                    if(!kardexStored){
                        done(null,false,req.flash('errorGuardarKardex','No se ha podido guardar el kardex'));
                        res.redirect('/addkardex');
                    }
                    done(null, false, req.flash('kardexGuardado', 'Kardex guardado correctamente'));
                    res.redirect('/addkardex');
                });
            }
        }
    },
    //metodo para obtener todos los kardex
    getKardexs:function(req,res, done){
        Kardex.find({}).exec((err,kardexs)=>{
            if(err) {
                done(null,false,req.flash('errorMostrarKardexs','Error al mostrar los kardexs, falla de servidor'));
                res.redirect('/kardex');
            }
            if(!kardexs) {
                done(null,false,req.flash('errorMostrarKardexs','No hay kardexs para mostrar'));
                res.redirect('/kardex');
            }
            //guardamos los kardexs con el mismo producto en un array
            var productosKardex=[];
            for(var i=0;i<kardexs.length;i++){
                //formateamos la fecha
                var fecha=kardexs[i].fecha;
                var dia=fecha.getDate();
                var mes=fecha.getMonth()+1;
                var anio=fecha.getFullYear();
                var fechaFormateada=dia+'/'+mes+'/'+anio;
                //cambiar fecha a string
                kardexs[i]=kardexs[i].toObject();
                kardexs[i].fecha=fechaFormateada;
                //verificamos si el producto ya esta en el array
                var index=productosKardex.findIndex(x=>x.producto==kardexs[i].producto);
                if(index==-1){
                    //si no esta lo agregamos
                    productosKardex.push({producto:kardexs[i].producto, kardexs:[kardexs[i]],stock:0});
                    //si es una entrada sumamos la cantidad al stock
                    if(kardexs[i].operacion=='Ingreso'){
                        productosKardex[productosKardex.length-1].stock+=kardexs[i].cantidad;
                    }
                    //si es una salida restamos la cantidad al stock
                    if(kardexs[i].operacion=='Salida'){
                        productosKardex[productosKardex.length-1].stock-=kardexs[i].cantidad;
                    }
                }else{
                    //si esta agregamos el kardex al array de kardexs
                    productosKardex[index].kardexs.push(kardexs[i]);
                    //si el tipo de operacion es salida, restamos la cantidad al stock
                    if(kardexs[i].operacion=='Salida'){
                        productosKardex[index].stock-=kardexs[i].cantidad;
                    }else{
                        //si es entrada sumamos la cantidad al stock
                        productosKardex[index].stock+=kardexs[i].cantidad;
                    }
                }
            }
            //ordenamos por fecha de menor a mayor
            for(var i=0;i<productosKardex.length;i++){
                productosKardex[i].kardexs.sort(function(a,b){
                    return new Date(a.fecha) - new Date(b.fecha);
                });
            }
            res.render('kardex',{kardexs: kardexs, productosKardex: productosKardex});
        });
    },
};

module.exports=controller;