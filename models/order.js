var database = require('./database')
var pool = database.pool;

module.exports.addOrder = function(username, name, email, address, phone, note, callback) {
    orderid = (new Date()).getTime()
    query = 'insert into "order" (orderid, username, name, email, address, phone, note) values (\'' + orderid + '\', \'' + username + '\',\'' + name + '\' , \'' + email + '\', \'' + address + '\', \'' + phone + '\' , \'' + note + '\')';

    pool.query(query, function(err, result) {
        callback(orderid)
    })
}

module.exports.getOrderList = function(callback) {
    query = "select * from \"order\""
    pool.query(query, function(err, result) {
        callback(result.rows)
    })
}

module.exports.findOrderById = function(id, callback) {
    query = "select * from \"order\" where orderid = '" + id + "'"
    pool.query(query, function(err, result) {
        callback(result.rows[0])
    })
}

module.exports.getOrderProductsById = function(id, callback) {
    query = "select * from products inner join order_product on products.id = order_product.productid where orderid = '" + id + "'"
    pool.query(query, function(err, result) {
        console.log(query)
        callback(result.rows)
    })
}

module.exports.getOrderStatusById = function(id, callback) {
    query = "select * from \"order_status\" where orderid = '" + id + "'"
    pool.query(query, function(err, result) {
        callback(result.rows)
    })
}

module.exports.setOrderStatusById = function(id, status, callback) {
    var todayDate = new Date();
    var todayDate = todayDate.toLocaleString();
    const query = {
        text: 'insert into "order_status" values($1, $2, $3)',
        values: [id, status, todayDate],
    }
    pool.query(query, function(err, result) {
        callback(result)
    })
}