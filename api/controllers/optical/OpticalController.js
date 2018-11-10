/**
 * OpticalController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * hiển thị màn hình index
     */
    actionIndexPage : function(req, res) {
        res.view('optical/opticalIndex');
    },
    /**
     * hiển thị màn hình index
     */
    actionLoadListOpticalType : function(req, res) {
        var callback = function(returnData) {
            res.json(returnData);
        };
        SysCatType.getListByParentId(req, Constants.SYS_CAT_TYPE.SYS_CAT_TYPE_OPTICAL, callback);
    },
    /**
     * Xử lý lưu thông tin syscattype
     */
    actionProcessSave : function(req, res) {
        var callbackError = function() {
            var result = {};
            result.message = sails.__("global.error");
            result.returnCode = Constants.COMMON.ERROR_CODE;
            res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
        };
        var formData = {
                name: req.param('name'),
                organizationId: req.session.user.organizationId,
                parentId: Constants.SYS_CAT_TYPE.SYS_CAT_TYPE_OPTICAL,
        };
        var sysCatTypeId = CommonUtils.NVL(req.param('sysCatTypeId'));
        if(sysCatTypeId > 0) {
            SysCatType.findOne({sysCatTypeId: sysCatTypeId}).exec((err, sysCatTypeBO) => {
                if(err) {
                    console.log(err);
                    return callbackError();
                } else if(sysCatTypeBO){
                    CommonUtils.havePermissionWithOrg(req, sysCatTypeBO.organizationId, function(ok) {
                        if(!ok) {
                            return callbackError();
                        }
                        SysCatType.update({sysCatTypeId: sysCatTypeId}, formData , function(err, sysCatTypeBO) {
                            if(err) {
                                console.log(err);
                                return callbackError();
                            } else {
                                var result = {};
                                result.message = sails.__('global.success');
                                result.returnCode = Constants.COMMON.SUCCESS_CODE;
                                result.callback = req.param('callback');
                                result.returnData = JSON.stringify(sysCatTypeBO[0]);
                                res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                            }
                        })
                    })
                } else {
                    return callbackError();
                }
            })
            
        } else {
            SysCatType.create(formData, function(err, sysCatType) {
                if(err) {
                    console.log(err);
                    return callbackError();
                } else {
                    var result = {};
                    result.message = sails.__('global.success');
                    result.returnCode = Constants.COMMON.SUCCESS_CODE;
                    result.callback = req.param('callback');
                    result.returnData = JSON.stringify(sysCatType);
                    res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                }
            });
        }
    },
    /**
     * lấy thông tin detail
     */
    actionLoadDetail: function(req, res) {
        SysCatType.loadSysCatList(req, res);
    },
    /**
     * lấy thông tin màn hình searh
     */
    actionPrepareSearch: function(req, res) {
        var sysCatTypeId = CommonUtils.getParameterLong(req, "sysCatTypeId");
        SysCatType.findOne({sysCatTypeId: sysCatTypeId}).exec((err, sysCatTypeBO) => {
            if(err) {
                console.log(err);
            }
            res.view('optical/opticalForm', {
                'sysCatTypeBO' : sysCatTypeBO
            });
        });
    },
    /**
     * lấy thông tin màn hình edit
     */
    actionPrepareUpdate: function(req, res) {
        var sysCatId = CommonUtils.getParameterLong(req, "sysCatId");
        SysCat.findOne({sysCatId: sysCatId}).exec((err, sysCatBO) => {
            if(err) {
                console.log(err);
            }
            if(!sysCatBO) {
                res.view('optical/opticalForm');
                return;
            }
            SysCatType.findOne({sysCatTypeId: sysCatBO.sysCatTypeId}).exec((err, sysCatTypeBO) => {
                if(err || !sysCatTypeBO) {
                    console.log(err);
                    var result = CommonUtils.createMessage("global.error", Constants.COMMON.ERROR_CODE, res);
                    res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                    return;
                }
                CommonUtils.havePermissionWithOrg(req, sysCatTypeBO.organizationId, function(boolean) {
                    if(!boolean) {
                        res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                        return;
                    }
                    res.view('optical/opticalForm', {
                        'sysCatTypeBO' : sysCatTypeBO,
                        'sysCatBO' : sysCatBO
                    });
                });
            });
        });
    },
    /**
     * lấy thông tin màn hình edit
     */
    actionProcessDelete: function(req, res) {
        var sysCatId = CommonUtils.getParameterLong(req, "sysCatId");
        SysCat.findOne({sysCatId: sysCatId}).exec((err, sysCatBO) => {
            if(err || !sysCatBO) {
                res.view('optical/opticalForm');
                return;
            }
            SysCatType.findOne({sysCatTypeId: sysCatBO.sysCatTypeId}).exec((err, sysCatTypeBO) => {
                if(err || !sysCatTypeBO) {
                    console.log(err);
                    var result = CommonUtils.createMessage("global.error", Constants.COMMON.ERROR_CODE, res);
                    res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                    return;
                }
                CommonUtils.havePermissionWithOrg(req, sysCatTypeBO.organizationId, function(boolean) {
                    if(!boolean) {
                        res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                        return;
                    }
                    SysCat.destroy({
                        sysCatId : sysCatId
                    }, function(err, ret) {
                        var result = {};
                        if (err) {
                            console.log(err);
                            result.message = sails.__('global.error');
                            result.returnCode = Constants.COMMON.ERROR_CODE;
                        } else {
                            result.message = sails.__('delete.succcess');
                            result.callback = 'callbackAfterSave';
                            result.returnCode = Constants.COMMON.SUCCESS_CODE;
                        }
                        res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                    });
                });
            });
        });
    },
    /**
     * Xử lý lưu thông tin SysCat
     */
    actionProcessSaveSysCat: function(req, res) {
        var sysCatTypeId = CommonUtils.NVL(req.param('sysCatTypeId'));
        if(sysCatTypeId <= 0) {
            var result = CommonUtils.createMessage("global.error", Constants.COMMON.ERROR_CODE, res);
            res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
            return;
        }
        SysCatType.findOne({sysCatTypeId: sysCatTypeId}).exec((err, sysCatTypeBO) => {
            if(err || !sysCatTypeBO) {
                console.log(err);
                var result = CommonUtils.createMessage("global.error", Constants.COMMON.ERROR_CODE, res);
                res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                return;
            }
            CommonUtils.havePermissionWithOrg(req, sysCatTypeBO.organizationId, function(boolean) {
                if(!boolean) {
                    res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                    return;
                }
                Organization.findOne({organization_id: sysCatTypeBO.organizationId}, (err, organizationBO) => {
                    var sysCatId = CommonUtils.NVL(req.param('sysCatId'));
                    var formData = {
                            name: req.param('name'),
                            price: CommonUtils.getParameterLong(req, 'price'),
                            cost: CommonUtils.getParameterLong(req, 'cost'),
                            unit: req.param('unit'),
                            warningValue: CommonUtils.getParameterLong(req, 'warningValue'),
                            description: CommonUtils.NVL(req.param('description')),
                            sysCatTypeId: sysCatTypeId,
                    };
                    SysCat.saveOrUpdate({sysCatId: sysCatId}, formData, function(err, sysCatBO) {
                        if(err) {
                            console.log(err);
                            var result = CommonUtils.createMessage("global.error", Constants.COMMON.ERROR_CODE, res);
                            res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                        } else {
                            var code = CommonUtils.sprintf(Constants.FORMAT.SYS_CAT_CODE, organizationBO.code, sysCatBO.sysCatId);
                            SysCat.update({ sysCatId: sysCatBO.sysCatId }, {code: code}).exec(function(err, sysCatBO) {
                                var result = {};
                                var result = CommonUtils.createMessage("global.success", Constants.COMMON.SUCCESS_CODE, res);
                                result.callback = req.param('callback');
                                result.returnData = JSON.stringify(sysCatBO);
                                res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                            });
                        }
                    });
                });
            });
        });
    },
    actionProcessDeleteType: function(req, res) {
        var sysCatTypeId = CommonUtils.NVL(req.param('sysCatTypeId'));
        if(sysCatTypeId <= 0) {
            var result = CommonUtils.createMessage("global.error", Constants.COMMON.ERROR_CODE, res);
            res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
            return;
        }
        SysCatType.findOne({sysCatTypeId: sysCatTypeId}).exec((err, sysCatTypeBO) => {
            if(err || !sysCatTypeBO) {
                console.log(err);
                var result = CommonUtils.createMessage("global.error", Constants.COMMON.ERROR_CODE, res);
                res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                return;
            }
            CommonUtils.havePermissionWithOrg(req, sysCatTypeBO.organizationId, function(boolean) {
                if(!boolean) {
                    res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                    return;
                }
                SysCatType.destroy({
                    sysCatTypeId : sysCatTypeId
                }, function(err, ret) {
                    var result = {};
                    if (err) {
                        console.log(err);
                        result.message = sails.__('global.error');
                        result.returnCode = Constants.COMMON.ERROR_CODE;
                    } else {
                        result.message = sails.__('delete.succcess');
                        result.returnCode = Constants.COMMON.SUCCESS_CODE;
                    }
                    res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                });
            });
        });
    }
}