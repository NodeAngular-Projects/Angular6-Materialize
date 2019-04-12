# Cafe Orders

Cafe Orders is an application created with Express, MongoDB, Angular6 and materialize-css. Cafe Order is for waitress and Cafe-owner - to save and calculate every order, to add new products or categories in the menu.

## Languages, Frameworks

- Angular6, Express,
- mongoose: MongoDB database ODM

# Used Libraries

- jwt, bcryptjs, moment, multer, validator
- materialize-css, ngx-toastr, chart.js

# General functionality

- Authenticate users via JWT
- Every authenticated user can:
  - create category and position
  - upload category image
  - update, delete category or position
  - add products to order
  - in total order - can delete a product
  - finish order and display it on history
  - search on history order in some range
  - display statistics for orders
  - display overview of yesterday orders
- Not authenticated user can: register, login
- Success and error messages for better UX
