var database = require('./database')
var pool = database.pool;

module.exports.getSales = function(from, to, callback) {
    if (from == undefined || to == undefined)
        callback(1)
    else {
        query = "select * from \"order\" inner join \"order_status\" on \"order_status\".orderid = \"order\".orderid where \"order_status\".status = '3' and \"order_status\".time between '" + from + " 00:00:00'::timestamp and '" + to + " 23:59:59'::timestamp"
        pool.query(query, function(err, result) {
            //console.log(query)
            callback(result.rows)
        })
    }
}