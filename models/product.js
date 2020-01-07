var database = require('./database')
var pool = database.pool;

module.exports.getItems = function(callback) {
    query = "select * from \"products\" limit 4";
    pool.query(query, function(err, result) {
        callback(result.rows);
    });
}

module.exports.getAllProducts = function(callback) {
    query = "select * from \"products\"";
    pool.query(query, function(err, result) {
        //console.log(result.rows)
        callback(result.rows);
    });
}

module.exports.getProductDetailById = function(id, callback) {
    query = "select * from \"products\" where id = '" + id + "'";
    //console.log(query)
    pool.query(query, function(err, result) {
        callback(result.rows[0])
    });
}

module.exports.getProductList = function(key, type, brand, price, order, callback) {
    var query,
        condition = 0
        // console.log("models:")
        // console.log(key)
        // console.log(type)
        // console.log(brand)
        // console.log(price)
        // console.log(order)

    query = "select * from \"products\""

    if (key != undefined && condition == 0) {
        query += " where ";
        condition = 1;
    }
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
    if (price != null && condition == 0) {
        condition = 1;
        query += " where ";
    }

    condition = 0

    if (key != undefined) {
        //console.log(key)
        query += "(to_tsvector(ten) @@ to_tsquery("
        keys = key.split(" ")
        for (i = 0; i < keys.length; i++) {
            query += "'" + keys[i] + "'";
        }
        query += "))"
        if (type != undefined && condition == 0) {
            if (type.length > 0 && type[0] != "All") {
                condition = 1;
                query += " and ";
            }
        }
        if (brand != undefined && condition == 0) {
            if (brand.length > 0) {
                query += " and ";
                condition = 1;
            }
        }
        if (price != null && condition == 0) {
            query += " and ";
            condition = 1;
        }
    }

    condition = 0

    if (type != undefined) {
        if (type.length > 0) {
            query += "(";
            for (i = 0; i < type.length; i++) {
                query += "loai = '" + type[i] + "'";
                if (i != type.length - 1)
                    query += " or ";
            }
            query += ")";
            if (brand != undefined && condition == 0) {
                if (brand.length > 0) {
                    query += " and ";
                    condition = 1;
                }
            }
            if (price != null && condition == 0)
                query += " and "; {
                condition = 1;
            }
        }
    }

    condition = 0

    if (brand != undefined) {
        if (brand.length > 0) {
            query += "(";
            for (i = 0; i < brand.length; i++) {
                query += "brand = '" + brand[i] + "'";
                if (i != brand.length - 1)
                    query += " or ";
            }
            query += ")";
            if (price != null) {
                query += " and ";
            }
        }
    }

    if (price != null) {
        var range = price.split("-");
        if (range.length == 2) {
            query += "gia between " + range[0] + " and " + range[1];
        } else
            query += "gia > 30000000 ";
    }

    query += " ORDER BY gia " + order;


    console.log(query)
    pool.query(query, function(err, result) {
        //console.log(result.rows)
        callback(result.rows);
    });
}

module.exports.editProductById = function(form, callback) {
    //console.log("form.anh: " + form.anh.length)
    if (form.anh.length > 30)
        query = "update \"products\" set ten = '" + form.ten + "', gia = '" + form.gia + "', mota = '" + form.mota +
        "', anh = '" + form.anh + "', loai = '" + form.loai + "', brand ='" + form.brand + "', kho ='" + form.kho + "' where id = '" + form.id + "'"
    else {
        query = "update \"products\" set ten = '" + form.ten + "', gia = '" + form.gia + "', mota = '" + form.mota +
            "', loai = '" + form.loai + "', brand ='" + form.brand + "', kho ='" + form.kho + "' where id = '" + form.id + "'"
            //console.log(query)
    }
    pool.query(query, function(err, result) {
        //console.log("editProductById2")
        callback(result)
    })
}

module.exports.removeProductById = function(id, callback) {
    query = "delete from \"products\" where id = '" + id + "'"
        // console.log(query)
    query2 = "delete from \"Product Images\" where id = '" + id + "'"
    pool.query(query, function(err, result1) {
        pool.query(query2, function(err, result2) {
            callback(result2)
        })
    })
}

module.exports.removeProductImageByImageId = function(imgId) {
    query = "delete from \"Product Images\" where imgid = '" + imgId + "'"
    pool.query(query, function(err, result) {})
}

module.exports.addProduct = function(form, callback) {
    // console.log("addProduct1")
    const query = {
            text: 'insert into "products" values($1, $2, $3, $4, $5, $6, $7, $8)',
            values: [form.id, form.ten, form.gia, form.mota, form.anh, form.brand, form.loai, form.kho],
        }
        // console.log(form.id)
        // console.log(form.ten)
        // console.log(form.gia)
        // console.log(form.mota)
        // console.log(form.brand)
        // console.log(form.loai)
        // console.log(form.kho)

    pool.query(query, function(err, result) {
        // console.log("addProduct2")
        // console.log(err)
        // console.log(result)
        callback(result)
    })
}

module.exports.getProductImagesById = function(id, callback) {
    query = "select * from \"Product Images\" where id = '" + id + "'"
        //console.log(query)
    pool.query(query, function(err, result) {
        // console.log("getProductImagesById:" + result.rows)
        callback(result.rows)
    })
}

module.exports.addProductImages = function(id, images, callback) {
    //console.log(images.length)
    if (images.length > 0 && images[0] != "")
        for (i = 0; i < images.length; i++) {
            module.exports.getNextIdForProductImageAdd(id, function(nextId) {
                //console.log("nextId:" + nextId)
                query = {
                    text: "insert into \"Product Images\" values ($1, $2, $3)",
                    values: [nextId, id, images[i]]
                }
                pool.query(query, function(err, result) {
                    //console.log(result)
                })
            })
        }
    callback(1)
}

module.exports.getProductTypes = function(callback) {
    query = "select * from \"Product Types\""
    pool.query(query, function(err, result) {
        callback(result.rows)
    })
}

module.exports.getProductBrands = function(callback) {
    query = "select distinct brand from \"products\""
    pool.query(query, function(err, result) {
        callback(result.rows)
    })
}

module.exports.getProductTypesById = function(id, callback) {
    query = "select * from \"Product Types\" where id = '" + id + "'"
    pool.query(query, function(err, result) {
        callback(result.rows[0])
    })
}

module.exports.getNextIdForProductAdd = function(type, callback) {
    module.exports.getAllProducts(function(items) {
        module.exports.getProductTypesById(type, function(resultType) {
            var max = 0,
                count = 1
            for (i = 0; i < items.length; i++) {
                if (items[i].loai == resultType.id) {
                    //console.log("item:" + items[i].id)
                    count = items[i].id.replace(resultType.prefix, "")
                        //console.log("item:" + count)
                    count = parseInt(count, 10);
                    //console.log(count)
                    if (count >= max) {
                        max = count
                            //console.log("max:" + max)
                    }
                }
            }
            nextId = resultType.prefix + (max + 1)
                //console.log("nextId:" + nextId)
            callback(nextId)
        })
    })
}


module.exports.getNextIdForProductImageAdd = function(id, callback) {
    prefix = id + "IMG"
    module.exports.getProductImagesById(id, function(items) {
        var max = 0,
            count = 1
        for (i = 0; i < items.length; i++) {
            if (items[i].imgid.includes(prefix)) {
                //console.log("item:" + items[i].imgid)
                count = items[i].imgid.replace(prefix, "")
                    //console.log("item:" + count)
                count = parseInt(count, 10);
                //console.log(count)
                if (count >= max) {
                    max = count
                        //console.log("max:" + max)
                }
            }
        }
        nextId = prefix + (max + 1)
            //console.log("nextId:" + nextId)
        callback(nextId)
    })
}