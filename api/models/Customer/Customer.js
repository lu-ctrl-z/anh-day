/**
 * Customer.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'customer',
    primaryKey: 'customer_id',
    attributes: {
        customer_id : {
            type: 'number',
            autoIncrement: true,
        },
        phone_number: {
            type: 'string',
            maxLength: 15,
        },
        full_name: {
            type: 'string',
            required: true,
            maxLength: 200,
        },
        address: {
            type: 'string',
        },
        organization_id : {
            type: 'number',
        },
    },
    formAttr: {
        customer_id: {
            form_type: sails.config.const.FORM_TYPE_HIDDEN
        },
        full_name: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        phone_number: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        address: {
            form_type: sails.config.const.FORM_TYPE_TEXTAREA
        }
    },
    /**
     * search danh sách khách hàng theo quyền của user.
     */
    getCustomerList: function(req, res) {
        var paramList = [];
        var i = 0; //$"+ (++i) + "
        var column = " SELECT " +
                     "  c.customer_id As customerId " +
                     ", c.phone_number As phoneNumber " +
                     ", c.full_name As fullName " +
                     ", c.address " +
                     ", (SELECT COUNT(*) FROM INVOICE iv WHERE iv.customer_id = c.customer_id ) As countInvoice " +
                     ", org1.organization_name As organizationName " +
                     ", c.updatedAt ";
        var from = " FROM CUSTOMER c " +
                   "    INNER JOIN ORGANIZATION org1 ON org1.organization_id = c.organization_id " +
                   "    INNER JOIN ORGANIZATION org2 ON org1.path LIKE CONCAT(org2.path, '%')" +
                   "    INNER JOIN M_USERS u ON u.organization_id = org2.organization_id " +
                   " WHERE " +
                   "    u.id = $"+ (++i) + " ";
        paramList.push(req.session.user['id']);
        if(!CommonUtils.isNullOrEmpty(req.param('phoneNumber'))) {
            from += " AND c.phone_number LIKE $"+ (++i) + " ";
            paramList.push('%' + req.param('phoneNumber') + '%');
        }
        if(!CommonUtils.isNullOrEmpty(req.param('fullName'))) {
            from += " AND c.full_name LIKE $"+ (++i) + " ";
            paramList.push('%' + req.param('fullName') + '%');
        }
        if(!CommonUtils.isNullOrEmpty(req.param('address'))) {
            from += " AND c.address LIKE $"+ (++i) + " ";
            paramList.push('%' + req.param('address') + '%');
        }
        var dataTableParam = DataTable.getParam(req);
        var mapColumns = {
                customerId: 'c.customer_id',
                phoneNumber: 'c.phone_number',
                fullName: 'c.full_name',
                address: 'c.address',
                organizationName: 'org1.organization_name',
                updatedAt: 'c.updatedAt',
            };
        var sortStr = DataTable.buildOrder(mapColumns, "c.updatedAt DESC ", req);
        var query = column + from + sortStr;
        var countQuery = "SELECT COUNT(*) As count " + from;
        DataTable.toJson(req, res, query, countQuery, paramList);
    },
    /**
     * autoComplete
     */
    autoComplete : function(code, organizationId, callback) {
        var paramList = [];
        var i = 0;// $" + (++i) + "
        var column = " SELECT " +
                     "  c.customer_id As customerId " +
                     ", c.phone_number As phoneNumber " +
                     ", c.full_name As fullName " +
                     ", c.address As address " +
                     ", c.organization_id As organizationId " +
                     ", c.createdAt As createdAt " +
                     ", ( SELECT i.data_optical FROM INVOICE i " +
                     "    WHERE i.customer_id = c.customer_id " +
                     "    AND i.invoice_id = (SELECT MAX(invoice_id) FROM INVOICE WHERE customer_id = c.customer_id AND data_optical IS NOT NULL ) " +
                     "  ) As dataOptical " +
                     ", o.organization_name As organizationName ";
        var from =  " FROM CUSTOMER c " +
                    "    INNER JOIN ORGANIZATION o ON o.organization_id = c.organization_id " +
                    " WHERE o.path LIKE $" + (++i) + " " +
                    " AND ( c.phone_number LIKE $" + (++i) + " " +
                    "    OR c.full_name LIKE $" + (++i) + " " +
                    "     ) " +
                    " LIMIT 10 ";
        var query = column + from;
        paramList.push('%/' + organizationId + '/%');
        paramList.push('%' + code + '%');
        paramList.push('%' + code + '%');
        Customer.query(query, paramList, function(err, resultList) {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                callback(resultList.rows);
            }
        });
    }
};

