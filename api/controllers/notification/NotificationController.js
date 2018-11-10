/**
 * NotificationController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var NotificationController = {};
/**
 * Chức năng đẩy thông báo
 */
NotificationController.get = function(req, res) {
    var timestamp = CommonUtils.getParameterLong(req, 'timestamp');
    var userId = req.session.user.id;
    Notification.getByTime()
}
module.exports = NotificationController;