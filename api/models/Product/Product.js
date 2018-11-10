/**
 * Product.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    primaryKey: 'productId',
    tableName: 'product',
    attributes: {
        productId : { // id
            type: 'number',
            autoIncrement: true,
            columnName: 'product_id',
        },
        sysCatId : {
            type: 'number',
            required: true,
            columnName: 'sys_cat_id',
        },
        isSold: {
            type: 'number',
            columnName: 'is_sold',
        },
        soldDate: {
            type: 'string',
            columnName: 'sold_date',
            columnType: 'datetime'
        },
        invoiceId : {
            type: 'number',
            columnName: 'invoice_id',
        },
        soldUser : {
            type: 'number',
            columnName: 'sold_user',
        },
        createdUser: {
            type: 'number',
            columnName: 'created_user',
        },
    },
    saleProduct: function(soldUser, invoiceId, sysCatId, quantity, callback) {
        var paramList = [];
        var column = " SELECT p.product_id As productId ";
        var from =  " FROM PRODUCT p " +
                    " WHERE p.is_sold = 0 " +
                    " AND p.sys_cat_id = ? " +
                    " LIMIT ? ";
        var query = column + from;
        paramList.push(parseInt(sysCatId));
        paramList.push(parseInt(quantity));
        Product.query(query, paramList, function(err, resultList) {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                var listProduct = [];
                var addProduct = [];
                var iFrom = 0;
                if(resultList && resultList.length > 0) {
                    iFrom = resultList.length;
                }
                for(iFrom; iFrom < quantity; iFrom++) {
                    addProduct.push({
                        sysCatId: parseInt(sysCatId),
                        invoiceId: parseInt(invoiceId),
                        isSold: 2,
                        soldDate: new Date(),
                        createdUser: soldUser,
                        soldUser: soldUser,
                    });
                }
                __addProduct(addProduct, function(productAdded) {
                    if(resultList && resultList.length > 0) {
                        var ids = [];
                        for(var i = 0; i < resultList.length; i++) {
                            ids.push(resultList[i].productId);
                        }
                        Product.update({productId: ids}, {
                            invoiceId: invoiceId,
                            isSold: 1,
                            soldDate: new Date(),
                            soldUser: soldUser,
                        }).exec(function(err, productUpdated) {
                            callback(productAdded, productUpdated);
                        });
                    } else {
                        callback(productAdded, []);
                    }
                });
            }
        });
        var __addProduct = function(addProduct, cb) {
            if(addProduct.length > 0) {
                Product.create(addProduct, function(err, productAdded) {
                    if (err) {
                        console.log(err);
                        callback(false);
                    } else {
                        cb(productAdded);
                    }
                });
            } else {
                cb([]);
            }
        }
    }
};

