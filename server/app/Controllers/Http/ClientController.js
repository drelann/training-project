"use strict";

const User = require("../../Models/User");

const Client = use("App/models/Client");

class ClientController {
  async getAll({ response }) {
    try {
      const clients = await Client.all();
      return response.status(200).json({
        clients,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка",
      });
    }
  }
  async destroy({ params, response }) {
    try {
      const client = await Client.findBy("id", params.id);
      client.delete();
      return response.status(200).json({
        message: "Клиент и записи напоминаний удалены",
        staus: "success",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Ошибка при удалении записи клиента, обновите страницу (CTRL+F5) и повторите операцию",
      });
    }
  }
  async update({ params, request, response }) {
    try {
      const client_new_data = request.only(["data"]);
      const client = await Client.findBy("id", params.id);
      client.name = client_new_data.data.name;
      client.email = client_new_data.data.email;
      client.phone = client_new_data.data.phone;
      client.date_of_birth = client_new_data.data.date;
      await client.save();

      return response.status(200).json(client);
    } catch {}
  }
  async create({ request, response }) {
    try {
      const client_data = request.only(["data"]);
      const client = await Client.create({
        name: client_data.data.name,
        email: client_data.data.email,
        phone: client_data.data.phone,
        date_of_birth: client_data.data.date_of_birth,
      });
      return response.status(200).json({
        status: "success",
        message: "Новый клиент, имя -  " + client.name + ", создан",
        data: client,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Прозошла ошибка при создании записи клиента, обновите страницу (CTRL+F5) и повторите операцию",
      });
    }
  }
}

module.exports = ClientController;
