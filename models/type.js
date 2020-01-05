var database = require('./database')
var pool = database.pool;

module.exports.getAllTypes = function(callback) {
    query = "select * from \"Product Types\" "
    pool.query(query, function(err, result) {
        callback(result.rows)
    })
}

module.exports.getTypeById = function(id, callback) {
    query = "select * from \"Product Types\" where id = '" + id + "'"
        //console.log(query)
    pool.query(query, function(err, result) {
        // console.log("getProductImagesById:" + result.rows)
        callback(result.rows[0])
    })
}

module.exports.editTypeById = function(form, callback) {
    // console.log(form.anh.length)
    if (form.anh.length > 0)
        query = "update \"Product Types\" set ten = '" + form.ten + "', anh = '" + form.anh + "' where id = '" + form.id + "'";
    else
        query = "update \"Product Types\" set ten = '" + form.ten + "' where id = '" + form.id + "'";

    pool.query(query, function(err, result) {
        callback(result)
    })
}

module.exports.addType = function(form, callback) {
    const query = {
            text: 'insert into "Product Types" values($1, $2, $3, $4)',
            values: [form.id, form.ten, form.anh, form.prefix],
        }
        // console.log(query)
    pool.query(query, function(err, result) {
        callback(result)
    })
}

module.exports.removeTypeById = function(id, callback) {
    query = "delete from \"Product Types\" where id = '" + id + "'"
    query2 = "delete from \"products\" where loai = '" + id + "'"

    pool.query(query, function(err, result) {
        pool.query(query2, function(err, result2) {
            // console.log(query)
            // console.log(query2)
            callback(result)
        })
    })
}