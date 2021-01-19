"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Document extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
  event() {
    return this.belongsTo("App/Models/Event");
  }
}

module.exports = Document;
