/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
        /***************************************************************************
         *                                                                          *
         * Default policy for all controllers and actions (`true` allows public     *
         * access)                                                                  *
         *                                                                          *
         ***************************************************************************/

         '*': ['authenticate'],
         //for admin
         'admin/AdminController': {
             '*' : ['authenticate', 'isAdmin'],
         },
         'admin/UserController': {
             '*' : ['authenticate'],
         },
         'HomeController': {
             '*' : ['authenticate', 'isLogin'],
         },
         //End
         /***************************************************************************
         *                                                                          *
         * Here's an example of mapping some policies to run before a controller    *
         * and its actions                                                          *
         *                                                                          *
         ***************************************************************************/
           'customer/CustomerController': {
               '*' : ['authenticate', 'isLogin'],
           },
           'invoice/InvoiceController': {
               '*' : ['authenticate', 'isLogin'],
           },
           'sysCat/SysCatController': {
               '*' : ['authenticate', 'isLogin'],
           },
           'optical/OpticalController': {
               '*' : ['authenticate', 'isLogin'],
           },
           'product/ProductController': {
               '*' : ['authenticate', 'isLogin'],
           },
           'sysCat/SysCatController': {
               '*' : ['authenticate', 'isLogin'],
           },
};
