"use strict";
const User = use("App/Models/User");
const Event = use("App/Models/Event");
const dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

class AdminController {
  async getAll({ response }) {
    try {
      //запрос к бд - юзеры
      const query = await User.query()
        .select(
          "id",
          "firstname",
          "lastname",
          "role",
          "event_id",
          "date_of_reg"
        )
        .whereNot("role", "=", "admin")
        .where("confirmed", 1)
        .fetch();
      //запрос к бд - мероприятия
      const query_events = await Event.query().select().fetch();
      //переводим в JSON
      const query_events_json = query_events.toJSON();
      const query_json = query.toJSON();
      //получаем сначала тех кто без роли (чтобы вставить в начало списка)
      const users_wo_role = query_json.filter((user) => {
        return user.role == "no_role";
      });

      //потом с ролью
      const users_w_role = query_json.filter((user) => {
        return user.role != "no_role";
      });
      //сортим тех кто без роли по дате регистрации
      users_wo_role.sort((a, b) =>
        dayjs(a.date_of_reg, "DD/MM/YYYY").isAfter(
          dayjs(b.date_of_reg, "DD/MM/YYYY")
        )
          ? 1
          : -1
      );
      //потом кто с ролью
      users_w_role.sort((a, b) =>
        dayjs(a.date_of_reg, "DD/MM/YYYY").isAfter(
          dayjs(b.date_of_reg, "DD/MM/YYYY")
        )
          ? 1
          : -1
      );
      //пихаем сначала тех кто без роли
      const users = users_wo_role;
      //потом кто с ролью
      users_w_role.forEach((user) => {
        users.push(user);
      });
      //каждому юзеру находим название мероприятия по значению event_id
      users.forEach((user) => {
        const event = query_events_json.filter((event) => {
          return event.id == user.event_id;
        });
        if (event[0]) {
          user.event_title = event[0].title;
        } else {
          user.event_title = null;
        }
      });
      //отдаем на фронт
      return response.status(200).json({
        users,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка",
      });
    }
  }
  //получить свободных юзеров из AssignDialog - getAllFreeUsers
  async getFree({ response }) {
    try {
      const users = await User.query()
        .select(
          "id",
          "firstname",
          "lastname",
          "role",
          "event_id",
          "date_of_reg"
        )
        .whereNot("role", "=", "admin")
        .where("event_id", null)

        .select()
        .fetch();
      return response.json({
        users,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка",
      });
    }
  }
  //изменить/убрать роль/меропрятие юзеру из панели "Admin"
  async editEventOrRole({ params, request, response }) {
    try {
      const editable_user = await User.findBy("id", params.id);
      const new_data = request.body.data;
      if (
        new_data == "no_role" ||
        new_data == "expert" ||
        new_data == "competitor"
      ) {
        editable_user.role = new_data;
      } else if (Number.isInteger(new_data) || new_data == null) {
        editable_user.event_id = new_data;
      }
      await editable_user.save();
      return response.status(200).json({
        status: "success",
        message: `Новые данные о пользователе ${editable_user.firstname} ${editable_user.lastname} сохранены`,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка изменения данных пользователя",
      });
    }
  }
}

module.exports = AdminController;
