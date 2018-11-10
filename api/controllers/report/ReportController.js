/**
 * ReportController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var ReportController = {};
/**
 * Báo cáo Tổng hợp
 */
ReportController.processReport = function(req, res) {
    var type = CommonUtils.getParameterLong(req, 'type');
    var fromDate = req.param('fromDate');
    var toDate = req.param('toDate');
    //thêm validate từ ngày, đến ngày tại đây
    if(type == 1) {
        ReportController.processRevenueReport(fromDate, toDate, req, res);
    } else if(type == 2) {
        ReportController.processArchiveReport(fromDate, toDate, req, res);
    } else {
        res.ok();
    }
}
/**
 * Báo cáo doanh thu
 */
ReportController.processRevenueReport = function(fromDate, toDate, req, res) {
    var organizationId = req.session.user['organizationId'];
    CommonUtils.havePermissionWithOrg(req, organizationId, function(boolean) {
        if(boolean) {
            Organization.findOne({organizationId: organizationId}).exec((err, organizationBO) => {
                Invoice.getRevenueReport(organizationId, fromDate, toDate, function(reportData) {
                    if(!reportData) {
                        reportData = [];
                    }
                    res.view('report/revenueReport', {
                            reportData: JSON.stringify(reportData),
                            organizationBO: organizationBO,
                            fromDate: fromDate,
                            toDate: toDate,
                        }
                    );
                })
            });
        } else {
            res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
        }
    })
}
/**
 * Báo cáo hàng tồn kho
 */
ReportController.processArchiveReport = function(fromDate, toDate, req, res) {
    var organizationId = req.session.user['organizationId'];
    var sysCatTypeId = CommonUtils.getParameterLong(req, 'sysCatTypeId');

    CommonUtils.havePermissionWithOrg(req, organizationId, function(boolean) {
        if(boolean) {
            Organization.findOne({organizationId: organizationId}).exec((err, organizationBO) => {
                Invoice.getArchiveReport(organizationId, fromDate, toDate, sysCatTypeId, function(reportData) {
                    if(!reportData) {
                        reportData = [];
                    }
                    res.view('report/archiveReport', {
                        reportData: JSON.stringify(reportData),
                        organizationBO: organizationBO,
                        fromDate: fromDate,
                        toDate: toDate,
                    }
                    );
                })
            });
        } else {
            res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
        }
    })
}
module.exports = ReportController;