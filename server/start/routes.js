"use strict";

const { route, get } = require("@adonisjs/framework/src/Route/Manager");
const UserController = require("../app/Controllers/Http/UserController");
const AdminController = require("../app/Controllers/Http/AdminController");
const DocumentController = require("../app/Controllers/Http/DocumentController");

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.post("login", "UserController.login");
Route.post("/register", "UserController.register");
Route.get("/send_mail", "UserController.sendMail");
Route.get("/verify_mail/:id", "UserController.verifyMail");

Route.group(() => {
  Route.put("/change_password", "UserController.changePassword");
  Route.get("getuser/:id", "UserController.show");
})
  .prefix("users")
  .middleware(["auth:jwt"]);

Route.group(() => {
  Route.get("/me", "UserController.me");
  Route.put("/update_profile", "UserController.updateProfile");
  Route.post("/upload_image", "UserController.uploadImage");
  Route.post("/verify_hash", "UserController.verifyHash");
  Route.post("/verify_pin", "UserController.verifyPin");
  Route.get("/delete_image", "UserController.deleteImage");
  Route.put("/change_pin", "UserController.changePin");
  Route.get("/delete_pin", "UserController.deletePin");
})
  .prefix("account")
  .middleware(["auth:jwt"]);

Route.group(() => {
  Route.get("/get_all_countries", "CountryController.getAll");
}).prefix("countires");

Route.group(() => {
  Route.get("/get_all_users", "AdminController.getAll");
  Route.get("/get_free_users", "AdminController.getFree");
  Route.put("/edit_event/:id", "AdminController.editEventOrRole");
  Route.put("/edit_role/:id", "AdminController.editEventOrRole");
}).prefix("admin");

Route.group(() => {
  Route.get("/get_all_events", "EventController.getAll");
  Route.get("/get_event/:id", "EventController.getEvent");
  Route.post("/save_event", "EventController.saveEvent");
  Route.post("/upload_image/:id", "EventController.uploadImage");
  Route.get("/delete_image/:id", "EventController.deleteImage");
  Route.put("update_event_info/:id", "EventController.updateEventInfo");
}).prefix("events");

Route.group(() => {
  Route.get("/get_all_documents/:id", "DocumentController.getAll");
  Route.put("/save_document/:id", "DocumentController.saveDocument");
  Route.post("/new_document/", "DocumentController.newDocument");
  Route.put("/delete_document/:id", "DocumentController.deleteDocument");
  //Route.get("/get_event/:id", "EventController.getEvent");
  //Route.post("/upload_image/:id", "EventController.uploadImage");
  //Route.get("/delete_image/:id", "EventController.deleteImage");
  //Route.put("update_event_info/:id", "EventController.updateEventInfo");
}).prefix("documents");
//
//
//
//
//
Route.group(() => {
  Route.post("create", "ReminderController.remind");
  Route.get("get_reminder/:id", "ReminderController.show");
  Route.get("get_all_reminders", "ReminderController.getAll");
  Route.delete("delete_reminder/:id", "ReminderController.destroy");
  Route.put("update_reminder_info/:id", "ReminderController.update");
  Route.post("create_new_remind", "ReminderController.create");
})
  .prefix("reminders")
  .middleware(["auth:jwt"]);

Route.group(() => {
  Route.get("get_all_clients", "ClientController.getAll");
  Route.delete("delete_client/:id", "ClientController.destroy");
  Route.put("update_client_info/:id", "ClientController.update");
  Route.post("create_new_client", "ClientController.create");
})
  .prefix("clients")
  .middleware(["auth:jwt"]);
