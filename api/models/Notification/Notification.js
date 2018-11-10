/**
 * Notification.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'notification',
    primaryKey: 'notificationId',
    attributes: {
        notificationId : { // id thông báo
            type: 'number',
            autoIncrement: true,
            columnName: 'notification_id',
        },
        isSeen : { // đã xem: 0 chưa xem, 1 đã xem
            type: 'number',
            required: true,
            columnName: 'is_seen',
        },
        isRead: { // Đã đọc: 0 chưa đọc, 1 đã đọc
            type: 'number',
            required: true,
            columnName: 'is_read',
        },
        warnningType: { // loại cảnh báo: 1 - notifi, 2 - warning, 3 - danger
            type: 'number',
            required: true,
            columnName: 'warnning_type',
        },
        userId: { // user nhận thông báo
            type: 'number',
            required: true,
            columnName: 'user_id',
        },
        message : { // message thông báo, có thể có chứa mã html
            type: 'text',
            columnName: 'message',
        },
        emailMessage : { // nội dung email thông báo, có thể có chứa mã html
            type: 'text',
            columnName: 'email_message',
        },
        extendCommandUrl : { // url command
            type: 'string',
            columnName: 'extend_command_url',
        },
        extendCommandButton : { // button
            type: 'string',
            columnName: 'extend_command_button',
        },
    },
};

