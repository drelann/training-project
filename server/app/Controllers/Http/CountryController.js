"use strict";

const Country = use("App/Models/Country");

class CountryController {
  async getAll({ response }) {
    try {
      const countries = await Country.all();
      return response.status(200).json({
        countries,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка",
      });
    }
  }
}

module.exports = CountryController;
