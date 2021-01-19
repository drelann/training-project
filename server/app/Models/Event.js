"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Event extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
  document() {
    return this.hasOne("App/Models/Document");
  }
}

module.exports = Event;
