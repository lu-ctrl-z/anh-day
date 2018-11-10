/**
 * SysCatType.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'sys_cat_type',
    primaryKey: 'sysCatTypeId',
    attributes: {
        sysCatTypeId : { // id
            type: 'number',
            autoIncrement: true,
            columnName: 'sys_cat_type_id',
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
        organizationId: {
            type: 'number',
            columnName: 'organization_id',
            required: true,
        },
        parentId : {
            type: 'number',
            columnName: 'parent_id',
        }
    },
    //lấy danh sách loại danh mục theo parentId
    //lấy loại danh mục theo quyền của user đăng nhập
    getListByParentId: function(req, parentId, callback) {
        var paramList = [];
        var column = " SELECT " +
                     "  t.sys_cat_type_id As sysCatTypeId " +
                     "  ,t.name As name " +
                     "  ,SUM(t.warning_count) As warningCount " +
                     "  ,SUM(t.warning_value) As warningValue " +
                     "  ,COUNT(DISTINCT t.sys_cat_id) As countSysCat " +
                     "  ,SUM(t.total) As total ";
        var from   = "  FROM ( " +
                     "    SELECT sct.sys_cat_type_id " +
                     "          ,sc.sys_cat_id " +
                     "          ,sct.name " +
                     "          ,CASE WHEN sc.warning_value - IFNULL(tbl.total, 0) > 0 THEN sc.warning_value - IFNULL(tbl.total, 0) ELSE 0 END As warning_count " +
                     "          ,sc.warning_value As warning_value " +
                     "          ,tbl.total As total " +
                     "    FROM SYS_CAT_TYPE sct " +
                     "    INNER JOIN ORGANIZATION org1 ON org1.organization_id = sct.organization_id " +
                     "    INNER JOIN ORGANIZATION org2 ON org2.organization_id = ? AND org1.path LIKE CONCAT(org2.path, '%') " + 
                     "    LEFT JOIN SYS_CAT sc ON sct.sys_cat_type_id= sc.sys_cat_type_id " +
                     "    LEFT JOIN ( " +
                     "        SELECT sc.sys_cat_id, COUNT(p.product_id) As total FROM SYS_CAT sc " +
                     "        INNER JOIN PRODUCT p ON p.sys_cat_id = sc.sys_cat_id AND p.is_sold = 0 " +
                     "        GROUP BY sc.sys_cat_id " +
                     "    ) tbl ON sc.sys_cat_id = tbl.sys_cat_id " +
                     "    WHERE sct.parent_id = ? " +
                     "      GROUP BY sct.sys_cat_type_id, sc.sys_cat_id " +
                     "  ) t " +
                     "  GROUP BY t.sys_cat_type_id "
                     ;

        paramList.push(req.session.user['organizationId']);
        paramList.push(parentId);
        var query = column + from;
        Dual.query(query, paramList, function(err, resultList) {
            callback(resultList);
        });
    },
    /**
     * ham lay danh muc theo loai danh muc
     */
    getSysCatList: function(sysCatTypeId, callback) {
        var paramList = [];
        var column = " SELECT " +
                     "  sc.sys_cat_id As sysCatId " +
                     "  ,sc.sys_cat_type_id As sysCatTypeId " +
                     "  ,sc.code As code " +
                     "  ,sc.name As name " +
                     "  ,sc.description As description ";
        var from =   " FROM SYS_CAT sc " +
                     " WHERE " +
                     "     sc.sys_cat_type_id = ? ";
        paramList.push(sysCatTypeId);
        var query = column + from;
        Dual.query(query, paramList, function(err, resultList) {
            callback(resultList);
        });
    },
    /**
     * ham lay danh muc theo loai danh muc
     */
    loadSysCatList: function(req, res, callback) {
        var paramList = [];
        var column = " SELECT " +
                     "  sc.sys_cat_id As sysCatId " +
                     "  ,sc.sys_cat_type_id As sysCatTypeId " +
                     "  ,sc.code As code " +
                     "  ,sc.name As name " +
                     "  ,sc.price As price " +
                     "  ,sc.unit As unit " +
                     "  ,sc.warning_value As warningValue " +
                     "  ,( SELECT COUNT(*) FROM PRODUCT p WHERE p.sys_cat_id = sc.sys_cat_id AND p.is_sold = 0 ) As totalProduct " +
                     "  ,sc.description As description ";
        var from =   " FROM SYS_CAT sc WHERE sc.sys_cat_type_id = ? ";
        paramList.push(CommonUtils.getParameterLong(req, "sysCatTypeId"));
        var dataTableParam = DataTable.getParam(req);
        var mapColumns = {
                sysCatId: 'sc.sys_cat_id',
                sysCatTypeId: 'sc.sys_cat_type_id',
                code: 'sc.code',
                price: 'sc.price',
                unit: 'sc.unit',
                name: 'sc.name',
                description: 'sc.description',
            };
        var sortStr = DataTable.buildOrder(mapColumns, "sc.createdAt DESC ", req);
        var query = column + from + sortStr;
        var countQuery = "SELECT COUNT(*) As count " + from;
        DataTable.toJson(req, res, query, countQuery, paramList, callback);
    },
    
};

