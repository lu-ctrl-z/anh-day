/**
 * Invoice.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'invoice',
    primaryKey: 'invoiceId',
    attributes: {
        invoiceId : { // id hóa đơn
            type: 'number',
            autoIncrement: true,
            columnName: 'invoice_id',
        },
        invoiceCode : { // code hóa đơn
            type: 'number',
            columnName: 'invoice_code',
        },
        customerId : { // id khách hàng
            type: 'number',
            /*required: true,*/
            columnName: 'customer_id',
        },
        totalPrice: { // tổng giá trị trên hóa đơn
            type: 'float',
            columnName: 'total_price',
        },
        trueTotalPrice: { // tổng tiền thực thu
            type: 'float',
            columnName: 'true_total_price',
        },
        totalDiscount: { // tổng giảm trừ
            type: 'float',
            columnName: 'total_discount',
        },
        cartList: {
            type: 'json',
            columnName: 'cart_list',
        },
        dataOptical: {
            type: 'json',
            columnName: 'data_optical',
        },
        note: {
            type: 'text',
            columnName: 'note',
        },
        status: {
            type: 'number',
            required: true, // 0: chưa phê duyệt, 1: đã phê duyệt
            columnName: 'status',
        },
    },
    /**
     * search danh sách Hoa don theo quyền của user.
     */
    getInvoiceList: function(req, res) {
        var paramList = [];
        var column = " SELECT " +
                     "  i.invoice_id As invoiceId " +
                     ", c.customer_id As customerId " +
                     ", i.invoice_code As invoiceCode " +
                     ", i.total_price As totalPrice " +
                     ", i.true_total_price As trueTotalPrice " +
                     ", c.phone_number As phoneNumber " +
                     ", c.full_name As fullName " +
                     ", org1.organization_name As organizationName " +
                     ", i.status As status " +
                     ", i.createdAt ";
        var from = " FROM CUSTOMER c " +
                   "    INNER JOIN INVOICE i ON i.customer_id = c.customer_id " +
                   "    INNER JOIN ORGANIZATION org1 ON org1.organization_id = c.organization_id " +
                   "    INNER JOIN ORGANIZATION org2 ON org1.path LIKE CONCAT(org2.path, '%')" +
                   "    INNER JOIN M_USERS u ON u.organization_id = org2.organization_id " +
                   " WHERE " +
                   "    u.id = ? ";
        paramList.push(req.session.user['id']);
        if(!CommonUtils.isNullOrEmpty(req.param('invoiceCode'))) {
            from += " AND i.invoice_code LIKE ? ";
            paramList.push('%' + req.param('invoiceCode') + '%');
        }
        if(!CommonUtils.isNullOrEmpty(req.param('fullName'))) {
            from += " AND c.full_name LIKE ? ";
            paramList.push('%' + req.param('fullName') + '%');
        }
        if(!CommonUtils.isNullOrEmpty(req.param('createdAt'))) {
            from += " AND DATE_FORMAT(i.createdAt, '%d/%m/%Y') = ? ";
            paramList.push(req.param('createdAt'));
        }
        var dataTableParam = DataTable.getParam(req);
        var mapColumns = {
                invoiceCode: 'i.invoice_code',
                totalPrice: 'i.total_price',
                trueTotalPrice: 'i.true_total_price',
                phoneNumber: 'c.phone_number',
                fullName: 'c.full_name',
                organizationName: 'org1.organization_name',
                createdAt: 'i.createdAt',
            };
        var sortStr = DataTable.buildOrder(mapColumns, "i.createdAt DESC ", req);
        var query = column + from + sortStr;
        var countQuery = "SELECT COUNT(*) As count " + from;
        DataTable.toJson(req, res, query, countQuery, paramList);
    },
    //xử lý báo cáo doanh số
    getRevenueReport: function(organizationId, fromDate, toDate, callback) {
        var paramList = [];
        var column = " SELECT " +
                     "  DATE_FORMAT(i.createdAt, '%d/%m/%Y') As dateReport " +
                     ", COUNT(i.invoice_id) As countInvoice " +
                     ", SUM(i.total_price) As totalPrice " +
                     ", SUM(i.true_total_price) As trueTotalPrice " +
                     ", SUM(i.total_discount) As totalDiscount ";
        var from = " FROM INVOICE i " +
                   "    INNER JOIN CUSTOMER c ON i.customer_id = c.customer_id " +
                   "    INNER JOIN ORGANIZATION org1 ON org1.organization_id = c.organization_id " +
                   "    INNER JOIN ORGANIZATION org2 ON org1.path LIKE CONCAT(org2.path, '%')" +
                   " WHERE " +
                   "    org2.organization_id = ? " +
                   "    AND i.status = 1 " +
                   "    AND ( DATE(i.createdAt) BETWEEN STR_TO_DATE(?, '%d/%m/%Y') AND STR_TO_DATE(?, '%d/%m/%Y') ) " +
                   " GROUP BY DATE_FORMAT(i.createdAt, '%d/%m/%Y') " +
                   " ORDER BY i.createdAt  ASC ";
        paramList.push(organizationId);
        paramList.push(fromDate);
        paramList.push(toDate);
        var query = column + from;
        Dual.query(query, paramList, function(err, resultList) {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                callback(resultList);
            }
        });
    },
    //xử lý báo cáo hàng tồn kho
    getArchiveReport: function(organizationId, fromDate, toDate, sysCatTypeId, callback) {
        var paramList = [];
        var query = " SELECT DATE_FORMAT(t1.selected_date, '%d/%m/%Y') As reportDate "
                   + "      ,SUM(CASE WHEN t2.soldDate IS NOT NULL AND DATE(t2.soldDate) = DATE(t1.selected_date) THEN 1 ELSE 0 END) As countSold " 
                   + "      ,SUM(CASE WHEN t2.soldDate IS NOT NULL AND DATE(t2.soldDate) <= DATE(t1.selected_date) THEN 0 ELSE 1 END) As countArchive "
                   + " FROM ( "
                   + "       SELECT v.selected_date FROM " 
                   + "         ( SELECT ADDDATE(STR_TO_DATE(?, '%d/%m/%Y'), t2.i*100 + t1.i*10 + t0.i) selected_date FROM "
                   + "           (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0, "
                   + "           (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1, "
                   + "           (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2 "
                   + "         ) v WHERE DATE(selected_date) BETWEEN STR_TO_DATE(?, '%d/%m/%Y') AND STR_TO_DATE(?, '%d/%m/%Y') " 
                   + "      ) t1 "
                   + " INNER JOIN "
                   + " ( "
                   + "  SELECT p.product_id, p.createdAt, p.is_sold , p.sold_date As soldDate "
                   + "  FROM sys_cat_type sct "
                   + "  INNER JOIN SYS_CAT sc ON sct.sys_cat_type_id = sc.sys_cat_type_id "
                   + "  INNER JOIN PRODUCT p  ON p.sys_cat_id = sc.sys_cat_id "
                   + "  WHERE sct.organization_id = ? "
                   + "  AND DATE(p.createdAt) <= STR_TO_DATE(?, '%d/%m/%Y') "
                   + (sysCatTypeId > 0 ? " AND sct.sys_cat_type_id = ? " : "")
                   + " ) t2 "
                   + " ON DATE(t2.createdAt) <= DATE(t1.selected_date) "
                   + "  GROUP BY t1.selected_date ";
        paramList.push(fromDate);
        paramList.push(fromDate);
        paramList.push(toDate);
        paramList.push(organizationId);
        paramList.push(toDate);
        if(sysCatTypeId > 0) {
            paramList.push(sysCatTypeId);
        }
        Dual.query(query, paramList, function(err, resultList) {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                callback(resultList);
            }
        });
    },
};

