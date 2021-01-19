"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Reminder extends Model {
  client() {
    return this.belongsTo("App/Models/Client");
  }
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
  static get dates() {
    return super.dates.concat(["date_of_remind"]);
  }
  static castDates(field, value) {
    if (field === "date_of_remind") {
      return value.format("DD/MM/YYYY");
    }
  }
  static formatDates(field, value) {
    if (field === "date_of_remind") {
      return value;
    }
    return super.formatDates(field, value);
  }
}

module.exports = Reminder;
