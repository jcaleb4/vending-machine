var ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db) {

    // If user is at default rout will show data
    app.get('/', function(req, res){
        db.collection('products').find().limit(9).toArray(function(err, products) {
            "use strict";
            // if error show error
            if (err) return callback(err, null);

            res.render('homepage', {myProducts: products});
        });
    });

    // Gets the ajax request from the front end, searches the product selected and 
    // decreases the value of the product by 1 and then send the new value to the page only for verification
    app.post('/getproduct', function(req, res){
        db.collection('products').update(req.body, {$inc : {quantity: -1}}, function(err, info){
            if (err) {
                callback(err, null);
            } else {
                db.collection('products').find(req.body).toArray(function(err, product) {
                    "use strict";

                    // if error show error
                    if (err) {
                        res.send(err);
                        //return callback(err, null);
                    }

                    res.send(product);
                });
            } 
        }); 
    });
}
