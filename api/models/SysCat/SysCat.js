/**
 * Syscat.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'sys_cat',
    primaryKey: 'sysCatId',
    attributes: {
        sysCatId : { // id
            type: 'number',
            autoIncrement: true,
            columnName: 'sys_cat_id',
        },
        code : {
            type: 'string',
            columnName: 'code',
            maxLength: 20,
        },
        name : {
            type: 'string',
            required: true,
            columnName: 'name',
            maxLength: 255,
        },
        description: {
            type: 'string',
            columnName: 'description',
            maxLength: 500,
        },
        sysCatTypeId: {
            type: 'number',
            required: true,
            columnName: 'sys_cat_type_id',
        },
        cost : {//giá gốc
            type: 'number',
            columnName: 'cost',
        },
        price : {//giá bán
            type: 'number',
            columnName: 'price',
        },
        deduction : {//khuyến mãi
            type: 'number',
            columnName: 'deduction',
        },
        unit: {
            type: 'string',
            columnName: 'unit',
            maxLength: 50,
        },
        warningValue: {
            type: 'number',
            columnName: 'warning_value',
        }
    },
    /**
     * findByBarcode
     */
    findByBarcode: function(code, callback) {
        var paramList = [];
        var i = 0;// $" + (++i) + "
        var column = " SELECT " +
                     "  sc.sys_cat_id As sysCatId " +
                     ", sc.code As code " +
                     ", sc.name As name " +
                     ", sc.price As price " + 
                     ", sct.name As typeName ";
        var from = " FROM SYS_CAT sc " +
                   "    INNER JOIN SYS_CAT_TYPE sct ON sct.sys_cat_type_id = sc.sys_cat_type_id " +
                   " WHERE " +
                   "    sc.code = $" + (++i) + " ";
        var query = column + from;
        paramList.push(code);
        SysCat.query(query, paramList, function(err, resultList) {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                callback(resultList);
            }
        });
    },
    /**
     * autoComplete
     */
    autoComplete: function(code, organizationId, callback) {
        var paramList = [];
        var i = 0;// $" + (++i) + "
        var column = " SELECT " +
                     "  sc.sys_cat_id As sysCatId " +
                     ", sc.code As code " +
                     ", sc.code As value " +
                     ", sc.unit As unit " +
                     ", sc.name As name " +
                     ", sc.price As price " +
                     ", o.tem_title_1 As temTitle1 " +
                     ", o.tem_title_2 As temTitle2 " +
                     ", o.image_path As imagePath " +
                     ", sct.name As typeName " +
                     ", (SELECT p.product_id FROM PRODUCT p WHERE p.sys_cat_id = sc.sys_cat_id AND p.is_sold = 0 LIMIT 1) As productId ";
        var from =  " FROM SYS_CAT sc " +
                    "    INNER JOIN SYS_CAT_TYPE sct ON sct.sys_cat_type_id = sc.sys_cat_type_id " +
                    "    INNER JOIN ORGANIZATION o ON o.organization_id = sct.organization_id " +
                    " WHERE sct.organization_id = $" + (++i) + "? " +
                    " AND ( sc.code LIKE $" + (++i) + " " +
                    "    OR sc.name LIKE $" + (++i) + " " +
                    "    OR sct.name LIKE $" + (++i) + " ) " +
                    " LIMIT 10 ";
        var query = column + from;
        paramList.push(organizationId);
        paramList.push('%' + code + '%');
        paramList.push('%' + code + '%');
        paramList.push('%' + code + '%');
        SysCat.query(query, paramList, function(err, resultList) {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                callback(resultList);
            }
        });
    }
};

