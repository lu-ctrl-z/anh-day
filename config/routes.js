/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  '*' : function(req, res, next) {
      if(req.session && req.session.user) {
          if(req.session.user.lang) {
              req.setLocale(req.session.user.lang);
          }
      } else {
          req.setLocale(sails.config.i18n.defaultLocale);
      }
      return next();
  },
  '/' : {
      controller : 'HomeController',
      action : 'home',
      locals : {
          layout : 'layouts/layout'
      }
  },
  '/admin' : {
      controller : 'admin/AdminController',
      action : 'index',
      locals : {
          layout : 'layouts/admin_layout'
      }
  },
  'get /login' : {
      controller : 'admin/UserController',
      action : 'login',
      locals : {
          layout : 'layouts/admin_layout'
      }
  },
  'post /login' : {
      controller : 'admin/UserController',
      action : 'doLoginAdmin',
      locals : {
          layout : 'layouts/admin_layout'
      }
  },
  '/logout' : {
      controller : 'admin/UserController',
      action : 'doLogout',
  },
  '/admin/user' : {
      controller : 'admin/AdminController',
      action : 'index',
      locals : {
          layout : 'layouts/admin_layout'
      }
  },
  // create user in admin
  'get /admin/user/add' : {
      controller : 'admin/AdminController',
      action : 'userForm',
      locals : {
          layout : 'layouts/admin_layout'
      }
  },
  'get /admin/user/edit' : {
      controller : 'admin/AdminController',
      action : 'userFormEdit',
      locals : {
          layout : 'layouts/admin_layout'
      }
  },
  'post /admin/user/edit' : {
      controller : 'admin/AdminController',
      action : 'userEdit',
      locals : {
          layout : 'layouts/admin_layout'
      }
  },
  'post /admin/user/add' : {
      controller : 'admin/AdminController',
      action : 'addUser',
      locals : {
          layout : 'layouts/admin_layout'
      }
  },

  //QL thông tin khách hàng
  '/customer' : {
      controller : 'customer/CustomerController',
      action : 'index',
      locals : {
          layout : 'layouts/layout'
      }
  },
  '/customer/list' : {
      controller : 'customer/CustomerController',
      action : 'actionLoadCustomer',
      locals : {
          layout : null
      }
  },
  'post /customer/save-and-invoice' : {
      controller : 'customer/CustomerController',
      action : 'actionSaveAndInvoice',
      locals : {
          layout : null
      }
  },
  '/customer/edit' : {
      controller : 'customer/CustomerController',
      action : 'actionPrepareUpdate',
      locals : {
          layout : null
      }
  },
  '/customer/delete' : {
      controller : 'customer/CustomerController',
      action : 'actionDelete',
      locals : {
          layout : null
      }
  },
  //QL thông tin đơn hàng
  '/invoice' : { // danh sach don hang
      controller : 'invoice/InvoiceController',
      action : 'actionIndexPage',
      locals : {
          layout : 'layouts/layouts/layout'
      }
  },
  '/invoice/list' : {
      controller : 'invoice/InvoiceController',
      action : 'actionLoadInvoice',
      locals : {
          layout : null
      }
  },
  '/invoice/form' : { // load form nhập đơn hàng
      controller : 'invoice/InvoiceController',
      action : 'actionPrepareUpdate',
      locals : {
          layout : 'layouts/popupLayout'
      }
  },
  'post /invoice/save-invoice' : { // Lưu thông tin đơn hàng
      controller : 'invoice/InvoiceController',
      action : 'actionProcessUpdate',
      locals : {
          layout : null
      }
  },
  '/invoice/delete' : { // Lưu thông tin đơn hàng
      controller : 'invoice/InvoiceController',
      action : 'actionProcessDelete',
      locals : {
          layout : null
      }
  },
  '/invoice/approve' : { // phê duyệt thông tin
      controller : 'invoice/InvoiceController',
      action : 'actionProcessApprove',
      locals : {
          layout : null
      }
  },
  //QL thông tin đơn hàng
  '/optical' : { // danh sach don hang
      controller : 'optical/OpticalController',
      action : 'actionIndexPage',
      locals : {
          layout : 'layouts/layout'
      }
  },
  '/optical/list-optical-type' : { // danh mục loại mắt kính
      controller : 'optical/OpticalController',
      action : 'actionLoadListOpticalType',
      locals : {
          layout : null
      }
  },
  '/optical/add-sys-cat-type' : { // danh mục loại mắt kính
      controller : 'optical/OpticalController',
      action : 'actionProcessSave',
      locals : {
          layout : null
      }
  },
  '/optical/delete-sys-cat-type' : { // danh mục loại mắt kính
      controller : 'optical/OpticalController',
      action : 'actionProcessDeleteType',
      locals : {
          layout : null
      }
  },
  '/optical/load-detail' : { // danh chi tiết
      controller : 'optical/OpticalController',
      action : 'actionLoadDetail',
      locals : {
          layout : null
      }
  },
  '/optical/prepare-search' : { // load form search
      controller : 'optical/OpticalController',
      action : 'actionPrepareSearch',
      locals : {
          layout : null
      }
  },
  '/optical/prepare-update' : { // load form edit
      controller : 'optical/OpticalController',
      action : 'actionPrepareUpdate',
      locals : {
          layout : null
      }
  },
  'post /optical/save-sys-cat' : { // Lưu thông tin hàng
      controller : 'optical/OpticalController',
      action : 'actionProcessSaveSysCat',
      locals : {
          layout : null
      }
  },
  'post /optical/delete' : { // Lưu thông tin hàng
      controller : 'optical/OpticalController',
      action : 'actionProcessDelete',
      locals : {
          layout : null
      }
  },
  '/sysCat' : {
      controller : 'sysCat/SysCatController',
      action : 'actionSysCatIndex',
      locals : {
          layout : 'layouts/layout'
      }
  },
  //product
  '/product' : {
      controller : 'product/ProductController',
      action : 'actionIndexPage',
      locals : {
          layout : 'layouts/layout'
      }
  },
  '/product/load-by-code' : {
      controller : 'product/ProductController',
      action : 'actionLoadByCode',
      locals : {
          layout : null
      }
  },
  '/customer/load-by-code' : {
      controller : 'customer/CustomerController',
      action : 'actionLoadByCode',
      locals : {
          layout : null
      }
  },
  '/product/process-save' : {
      controller : 'product/ProductController',
      action : 'actionProcessSave',
      locals : {
          layout : null
      }
  },
  '/sale' : {
      controller : 'product/ProductController',
      action : 'actionSalePage',
      locals : {
          layout : 'layouts/layout'
      }
  },
  '/sale/invoice-save' : {
      controller : 'product/ProductController',
      action : 'actionSaleInvoiceSave',
      locals : {
          layout : null
      }
  },
  '/sale/invoice-view' : {
      controller : 'product/ProductController',
      action : 'actionSaleInvoiceView',
      locals : {
          layout : 'layouts/layouts/popupLayout'
      }
  },
  //báo cáo
  '/report' : {
      controller : 'report/ReportController',
      action: 'processReport',
      locals : {
          layout : null
      }
  }
};
