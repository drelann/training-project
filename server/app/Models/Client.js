"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Client extends Model {
  reminders() {
    return this.hasMany("App/Models/Reminder");
  }
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
  static get dates() {
    return super.dates.concat(["date_of_birth"]);
  }
  static castDates(field, value) {
    if (field === "date_of_birth") {
      return value.format("DD/MM/YYYY");
    }
  }
  static formatDates(field, value) {
    if (field === "date_of_birth") {
      return value;
    }
    return super.formatDates(field, value);
  }
}

module.exports = Client;
