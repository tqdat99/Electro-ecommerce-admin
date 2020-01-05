var database = require('./database')
var pool = database.pool;

module.exports.getAllAdvertisements = function(callback) {
    query = "select * from \"Advertisements\" "
    pool.query(query, function(err, result) {
        callback(result.rows)
    })
}

module.exports.getAllActiveAdvertisements = function(callback) {
    query = "select * from \"Advertisements\" where status = 'active'"
    pool.query(query, function(err, result) {
        callback(result.rows)
    })
}

module.exports.getAdvertisementById = function(id, callback) {
    query = "select * from \"Advertisements\" where id = '" + id + "'"
        //console.log(query)
    pool.query(query, function(err, result) {
        // console.log("getProductImagesById:" + result.rows)
        callback(result.rows[0])
    })
}

module.exports.editAdvertisementById = function(form, callback) {
    //console.log(form.anh.length)
    if (form.anh.length > 0)
        query = "update \"Advertisements\" set anh = '" + form.anh + "', link = '" + form.link + "' where id = '" + form.id + "'";
    else
        query = "update \"Advertisements\" set link = '" + form.link + "' where id = '" + form.id + "'";
    pool.query(query, function(err, result) {
        callback(result)
    })
}

module.exports.addAdvertisement = function(form, callback) {
    const query = {
            text: 'insert into "Advertisements" values($1, $2, $3, $4)',
            values: [form.id, form.anh, "active", form.link],
        }
        // console.log(query)
    pool.query(query, function(err, result) {
        callback(result)
    })
}

module.exports.removeAdvertisementById = function(id, callback) {
    query = "delete from \"Advertisements\" where id = '" + id + "'"
        //console.log(query)
    pool.query(query, function(err, result) {
        //console.log(result)
        callback(result)
    })
}

module.exports.lockAdvertisementById = function(id, callback) {
    query = "update \"Advertisements\" set status = 'locked' where id = '" + id + "'"
        //console.log(query)
    pool.query(query, function(err, result) {
        //console.log(result)
        callback(result)
    })
}

module.exports.unlockAdvertisementById = function(id, callback) {
    query = "update \"Advertisements\" set status = 'active' where id = '" + id + "'"
        //console.log(query)
    pool.query(query, function(err, result) {
        //console.log(result)
        callback(result)
    })
}

module.exports.getNextIdForAdvertisementAdd = function(callback) {
    module.exports.getAllAdvertisements(function(items) {
        var max = 0,
            count = 1
            //console.log(items.length)
        for (i = 0; i < items.length; i++) {
            //console.log("item:" + items[i].id)
            count = items[i].id.replace("AD", "")
                //console.log("item:" + count)
            count = parseInt(count, 10);
            //console.log(count)
            if (count >= max) {
                max = count
                    //console.log("max:" + max)
            }
        }
        nextId = "AD" + (max + 1)
            //console.log("nextId:" + nextId)
        callback(nextId)
    })
}