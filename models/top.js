var database = require('./database')
var pool = database.pool;

module.exports.getToptList = function(type, brand, order, callback) {
    var query,
        condition = 0
        // console.log("models:")
        // console.log(key)
        // console.log(type)
        // console.log(brand)
        // console.log(price)
        // console.log(order)

    query = "select products.id, products.ten, products.gia, products.anh, products.brand, products.loai, products.kho, sum(quantity) from products inner join order_product on products.id = order_product.productid "

    if (type != undefined && condition == 0) {
        if (type.length > 0) {
            query += " where ";
            condition = 1;
        }
    }
    if (brand != undefined && condition == 0) {
        if (brand.length > 0) {
            query += " where ";
            condition = 1;
        }
    }

    condition = 0

    if (type != undefined) {
        if (type.length > 0) {
            query += "(";
            for (i = 0; i < type.length; i++) {
                query += "products.loai = '" + type[i] + "'";
                if (i != type.length - 1)
                    query += " or ";
            }
            query += ")";
            if (brand != undefined) {
                if (brand.length > 0)
                    query += " and ";
            }
        }
    }


    if (brand != undefined) {
        if (brand.length > 0) {
            query += "(";
            for (i = 0; i < brand.length; i++) {
                query += "products.brand = '" + brand[i] + "'";
                if (i != brand.length - 1)
                    query += " or ";
            }
            query += ")";
        }
    }

    query += "group by products.id order by sum(quantity) " + order + " limit 10"

    console.log(query)
    pool.query(query, function(err, result) {
        //console.log(result.rows)
        callback(result.rows);
    });
}