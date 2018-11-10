/**
 * Invoice.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'invoice_product',
    primaryKey: 'invoiceProductId',
    attributes: {
        invoiceProductId : { // id hóa đơn
            type: 'number',
            autoIncrement: true,
            columnName: 'invoice_product_id',
        },
        invoiceId : { // id hóa đơn
            type: 'number',
            columnName: 'invoice_id',
            required: true,
        },
        productId: { // tổng giá trị trên hóa đơn
            type: 'float',
            required: true,
            columnName: 'product_id',
        },
    },
};

