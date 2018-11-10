/**
 * Customer.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'organization',
    primaryKey: 'organizationId',
    attributes: {
        organizationId : {
            type: 'number',
            autoIncrement: true,
            columnName: 'organization_id',
        },
        code: {
            type: 'string',
            maxLength: 20,
            required: true,
            columnName: 'code',
        },
        organizationName: {
            type: 'string',
            maxLength: 500,
            required: true,
            columnName: 'organization_name',
        },
        path: {
            type: 'string',
            maxLength: 500,
            required: true,
            columnName: 'path',
        },
        address: {
            type: 'string',
            columnName: 'address',
            allowNull: true,
        },
        taxNumber: {
            type: 'string',
            columnName: 'tax_number',
            allowNull: true,
        },
        phoneNumber: {
            type: 'string',
            columnName: 'phone_number',
            allowNull: true,
        },
        imagePath: {
            type: 'string',
            columnName: 'image_path',
            allowNull: true,
        },
        temTitle1: {
            type: 'string',
            columnName: 'tem_title_1',
            allowNull: true,
        },
        temTitle2: {
            type: 'string',
            columnName: 'tem_title_2',
            allowNull: true,
        }
    },
};

