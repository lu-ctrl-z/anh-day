/**
 * ProductController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */
var ProductController = {};
/**
 * hàm xử lý load thông tin màn hình nhập sản phẩm
 */
ProductController.actionIndexPage = function(req, res) {
    res.view('product/productIndex');
}
/**
 * Hàm xử lý load thông tin quyet mã vach
 */
ProductController.actionLoadByCode = function(req, res) {
    var code = req.param('code');
    SysCat.autoComplete(code, req.session.user.organizationId, function(resultList) {
        if(resultList) {
            res.json(resultList);
        } else {
            res.json([]);
        }
    });
}
ProductController.actionProcessSave = function(req, res) {
    var productList = req.param('productList');
    var callbackAfterSaveOrUpdate = function(err, product){
        if(err) {
            console.log(err);
            var result = {};
            result.message = sails.__("global.error");
            result.returnCode = Constants.COMMON.ERROR_CODE;
            res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
        } else {
            var result = {};
            result.returnCode = Constants.COMMON.SUCCESS_CODE;
            result.callback = req.param('callback');
            result.message = "";
            res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
        }
    }
    
    productList.forEach(function(item, index) {
        var formData = [];
        for(var i=0; i < item.quantity; i++) {
            formData.push({
                sysCatId: item.sysCatId,
                isSold: 0,
                createdUser: req.session.user.id
            })
        }
        Product.create(formData, callbackAfterSaveOrUpdate);
    });
}
/**
 * ham thuc hien load man hinh xuat hoa don
 */
ProductController.actionSalePage = function(req, res) {
    res.view('product/productSaleIndex');
}
/**
 * ham thuc hien load man hinh xuat hoa don
 */
ProductController.actionSaleInvoiceSave = function(req, res) {
    var invoiceData = req.param('invoice');
    var customer = req.param('customer');
    var customerId = 0;
    if(customer && customer.customer_id) {
        customerId = CommonUtils.NVL(customer.customer_id);
    }
    var invoiceId = CommonUtils.NVL(invoiceData.invoiceId);
    if(invoiceId > 0) {} else {
        invoiceData.invoiceId = null;
    }
    var customerData = {
        full_name: customer.full_name,
        phone_number: customer.phone_number,
        address: customer.address,
        organization_id: req.session.user.organizationId,
    };

    var callBackError = function(message) {
        var result = {};
        result.returnCode = Constants.COMMON.ERROR_CODE;
        result.callback = req.param('callback');
        result.message = message;
        res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
    }
    var afterSaveCustomer = function(err, customerSaved) {
        if(err) {
            console.log(err);
            callBackError("Lưu thông tin không thành công, hãy thử lại");
        } else {
            invoiceData.status = 0;
            invoiceData.customerId = customerSaved.customer_id || customerSaved[0].customer_id;
            Invoice.saveOrUpdate({invoiceId: invoiceId}, invoiceData, afterSaveInvoice);
        }
    }
    var afterSaveInvoice = function(err, invoiceSaved) {
        if(err) {
            console.log(err);
            callBackError("Lưu thông tin không thành công, hãy thử lại");
        } else {
            if(invoiceSaved && !invoiceSaved.invoiceId) {
                invoiceSaved = invoiceSaved[0];
            }
            if(invoiceSaved.cartList && invoiceSaved.cartList.length > 0) {
                for(var i = 0; i < invoiceSaved.cartList.length; i++) {
                    var item = invoiceSaved.cartList[i];
                    if(!item.isSubmited) {
                        Product.saleProduct(req.session.user.id, invoiceSaved.invoiceId, item.sysCatId, item.quantity, function(productAdded, productUpdated) {
                            console.log(productAdded, productUpdated)
                        });
                    }
                }
            }
            var invoiceCode = CommonUtils.sprintf("1%'09s", invoiceSaved.invoiceId);
            Invoice.update({ invoiceId: invoiceSaved.invoiceId }, {invoiceCode: invoiceCode})
                   .exec(function(err, invoiceFinal) {
                        if(invoiceFinal && !invoiceFinal.invoiceId) {
                            invoiceFinal = invoiceFinal[0];
                        }
                        var result = {};
                        result.returnCode = Constants.COMMON.SUCCESS_CODE;
                        result.extraValue = invoiceFinal.invoiceId;
                        result.callback = 'saveSaleSuccess';
                        result.message = sails.__("global.success");
                        res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                   });
        }
    }
    var updateCustomer = function(__customerId) {
        Customer.findOne({
            customer_id: __customerId
        }).exec((err, customerBO) => {
            if (err) {
                console.log(err);
                callBackError("Lưu thông tin không thành công, hãy thử lại");
            } else if (customer) {
                CommonUtils.havePermissionWithOrg(req, customerBO.organization_id, function(boolean) {
                    if(boolean) {
                        Customer.update({ customer_id : __customerId }, customerData)
                                .exec(afterSaveCustomer);
                    } else {
                        res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                    }
                })
            } else {
                res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
            }
        });
    };
    if(customerId > 0) {
        updateCustomer(customerId);
    } else {
        if(invoiceId > 0) {
            Invoice.findOne({
                invoiceId: invoiceId
            }).exec((err, invoiceBO) => {
                if (err) {
                    console.log(err);
                    callBackError("Lưu thông tin không thành công, hãy thử lại");
                } else if (invoiceBO) {
                    updateCustomer(invoiceBO.customerId);
                } else {
                    res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                }
            });
        } else {
            Customer.create(customerData, afterSaveCustomer);
        }
    }
}
/**
 * actionSaleInvoiceView
 */
ProductController.actionSaleInvoiceView = function(req, res) {
    var invoiceId = CommonUtils.NVL(req.param('invoiceId'));
    var processFail = function() {
        res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
    };
    if(invoiceId < 0) {
        return processFail();
    }
    Invoice.findOne({invoiceId: invoiceId}).exec((err, invoiceBO) => {
        if (err) {
            console.log(err);
            return processFail();
        } else if (invoiceBO) {
            var customerId = invoiceBO.customerId;
            Customer.findOne({
                customer_id: customerId
            }).exec((err, customerBO) => {
                if (err) {
                    console.log(err);
                    return processFail();
                } else if (customerBO) {
                    CommonUtils.havePermissionWithOrg(req, customerBO.organization_id, function(boolean) {
                        if(!boolean) {
                            return processFail();
                        }
                        var siteTitle = sails.__("invoice.name") + " " + customerBO.full_name;
                        Organization.findOne({
                            organizationId: customerBO.organization_id
                        }).exec((err, organizationBO) => {
                            res.view('product/saleInvoice', {
                                'customer' : customerBO,
                                'invoice' : invoiceBO,
                                'organization' : organizationBO,
                                'siteTitle' : siteTitle
                            });
                        })
                    });
                } else {
                    return processFail();
                }
            });
        } else {
            return processFail();
        }
    })
}


module.exports = ProductController;
