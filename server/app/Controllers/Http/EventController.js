"use strict";
const User = use("App/Models/User");
const Event = use("App/Models/Event");
const Country = use("App/Models/Country");
const base64Img = require("base64-img");
const Drive = use("Drive");
const Helpers = use("Helpers");
const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

class EventController {
  async getEvent({ params, response }) {
    try {
      const query = await Event.find(params.id);
      const event = query.toJSON();
      const query_ids = await User.query().select("event_id").fetch();
      const query_ids_json = query_ids.toJSON();
      const howMany = (arrayOfObj, property) => {
        const counts = arrayOfObj.reduce((acc, obj) => {
          const value = obj[property];
          return acc.set(value, acc.has(value) ? acc.get(value) + 1 : 1);
        }, new Map());

        return (search) => counts.get(search) || 0;
      };
      event.participants_ids = await User.query()
        .select("id")
        .where("event_id", event.id)
        .fetch();
      event.participants = howMany(query_ids_json, "event_id")(event.id);
      event.start_date_format = "";
      event.c1_date_format = "";
      event.c_plus_1_date_format = "";
      event.finish_date_format = "";
      event.start_date_format = dayjs(event.start_date, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      event.c1_date_format = dayjs(event.c1_date, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      event.c_plus_1_date_format = dayjs(
        event.c_plus_1_date,
        "DD/MM/YYYY"
      ).format("YYYY-MM-DD");
      event.finish_date_format = dayjs(event.finish_date, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      return response.status(200).json({
        event,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка получения данных мероприятия",
      });
    }
  }
  async getAll({ response }) {
    try {
      console.time("someFunction");
      const query = await Event.query().select().fetch();
      const query_ids = await User.query().select("event_id").fetch();
      const query_json = query.toJSON();
      const query_ids_json = query_ids.toJSON();
      //метод для подсчета количества пользователей, записанных на мероприятия
      //может принимать любой массив объектов, с выбором подсчета поля
      const howMany = (arrayOfObj, property) => {
        const counts = arrayOfObj.reduce((acc, obj) => {
          const value = obj[property];
          return acc.set(value, acc.has(value) ? acc.get(value) + 1 : 1);
        }, new Map());

        return (search) => counts.get(search) || 0;
      };
      for await (const event of query_json) {
        event.participants_ids = await User.query()
          .select("id")
          .where("event_id", event.id)
          .fetch();
        //С js функцией
        event.participants = howMany(query_ids_json, "event_id")(event.id);
      }

      //сортировка согласно презентации
      var events = [];
      //добавляем текущие мероприятия
      query_json.forEach((event) => {
        if (
          dayjs().isBetween(
            dayjs(event.start_date, "DD/MM/YYYY"),
            dayjs(event.finish_date, "DD/MM/YYYY"),
            null,
            "[]"
          )
        ) {
          events.push(event);
        }
      });
      //ищем будущие мероприятия
      var future_events = [];
      query_json.forEach((event) => {
        if (dayjs().isBefore(dayjs(event.start_date, "DD/MM/YYYY"))) {
          future_events.push(event);
        }
      });
      //сортим будущие мероприятия
      future_events.sort((a, b) =>
        dayjs(a.start_date, "DD/MM/YYYY").isAfter(
          dayjs(b.start_date, "DD/MM/YYYY")
        )
          ? 1
          : -1
      );
      //добавляем будущие мероприятия
      future_events.forEach((event) => {
        events.push(event);
      });
      //ищем прошедшие мероприятия
      var past_events = [];
      query_json.forEach((event) => {
        if (dayjs().isAfter(dayjs(event.finish_date, "DD/MM/YYYY"))) {
          past_events.push(event);
        }
      });
      //сортим прошедшие мероприятия
      past_events.sort((a, b) =>
        dayjs(a.finish_date, "DD/MM/YYYY").isBefore(
          dayjs(b.finish_date, "DD/MM/YYYY")
        )
          ? 1
          : -1
      );
      //добавляем прошедшие мероприятия
      past_events.forEach((event) => {
        events.push(event);
      });
      console.timeEnd("someFunction");
      return response.status(200).json({
        status: "succes",
        events,
        message: "Успех",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка получения списка мероприятий",
      });
    }
  }
  async uploadImage({ request, params, response }) {
    try {
      const id = params.id;
      const event = await Event.query().where("id", id).select().firstOrFail();
      const file = request.body.data;
      const ext =
        file.substring("data:image/".length, file.indexOf(";base64")) == "jpeg"
          ? "jpg"
          : file.substring("data:image/".length, file.indexOf(";base64"));
      const name = Date.now();
      base64Img.img(
        file,
        `${Helpers.publicPath()}/events/`,
        name,
        function (err, filepath) {
          const pathArr = filepath.split("/");
          const fileName = pathArr[pathArr.length - 1];
        }
      );

      if (event.eventpic != "placeholder.png") {
        await Drive.delete(`${Helpers.publicPath()}/events/${event.eventpic}`);
      }
      event.eventpic = name + "." + ext;
      await event.save();
      return response.status(200).json({
        status: "success",
        data: event.eventpic,
        message: "Изображение мероприятия изменено",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Ошибка смены фото, попробуйте перезагрузить страницу (CTRL+F5)",
      });
    }
  }
  async deleteImage({ params, response }) {
    try {
      const id = params.id;
      const event = await Event.query().where("id", id).select().firstOrFail();
      await Drive.delete(`${Helpers.publicPath()}/events/${event.eventpic}`);
      event.eventpic = "placeholder.png";
      await event.save();
      return response.status(200).json({
        status: "success",
        message: "Изображение мероприятия удалено",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Ошибка удаления фото, попробуйте перезагрузить страницу (CTRL+F5)",
      });
    }
  }
  async saveEvent({ request, response }) {
    try {
      const new_event = {
        title: request.body.data.title,

        start_date: dayjs(request.body.data.dates[0], "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        ),
        c1_date: dayjs(request.body.data.dates[1], "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        ),
        c_plus_1_date: dayjs(request.body.data.dates[2], "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        ),
        finish_date: dayjs(request.body.data.dates[3], "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        ),
      };
      if (request.body.data.eventpic != "") {
        const file = request.body.data.eventpic;
        const ext =
          file.substring("data:image/".length, file.indexOf(";base64")) ==
          "jpeg"
            ? "jpg"
            : file.substring("data:image/".length, file.indexOf(";base64"));
        const name = Date.now();
        base64Img.img(
          file,
          `${Helpers.publicPath()}/events/`,
          name,
          function (err, filepath) {
            const pathArr = filepath.split("/");
            const fileName = pathArr[pathArr.length - 1];
          }
        );

        new_event.eventpic = name + "." + ext;
      } else {
        new_event.eventpic = "placeholder.png";
      }
      console.log(new_event);
      const event = await Event.create(new_event);
      return response.status(200).json({
        status: "success",
        data: event,
        message: "Мероприятие создано",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка",
      });
    }
  }
  async updateEventInfo({ params, request, response }) {
    try {
      const query = await Event.find(params.id);
      const new_data = request.body.data;
      if (query.title != new_data.title) {
        query.title = new_data.title;
        await query.save();
        return response.json({
          data: query,
          status: "success",
          message: "Названия мероприятие изменено",
        });
      } else if (
        query.start_date != new_data.start_date ||
        query.c1_date != new_data.c1_date ||
        query.c_plus_1_date != new_data.c_plus_1_date ||
        query.finish_date != new_data.finish_date
      ) {
        query.start_date = dayjs(new_data.start_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );
        query.c1_date = dayjs(new_data.c1_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );
        query.c_plus_1_date = dayjs(
          new_data.c_plus_1_date,
          "YYYY-MM-DD"
        ).format("DD/MM/YYYY");
        query.finish_date = dayjs(new_data.finish_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );
        await query.save();
        return response.status(200).json({
          data: query,
          status: "success",
          message: "Даты проведения мероприятия изменены",
        });
      } else {
        return response.status(200).json({
          status: "warning",
          message: "Изменений не зафиксировано",
        });
      }
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка изменения данных мероприятия",
      });
    }
  }
}

module.exports = EventController;
