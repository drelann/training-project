"use strict";
const User = use("App/Models/User");
const Event = use("App/Models/Event");
const Document = use("App/Models/Document");
const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");

var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");

var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
var customParseFormat = require("dayjs/plugin/customParseFormat");
var advancedFormat = require("dayjs/plugin/advancedFormat");

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

class DocumentController {
  async getAll({ params, response }) {
    try {
      const id = params.id;
      const event_json = await Event.query().select().where("id", id).fetch();
      const event = event_json.toJSON();
      const documents_json = await Document.query()
        .select()
        .where("event_id", id)
        .andWhere("availability", null)
        .fetch();
      const documents = documents_json.toJSON();
      documents.sort((a, b) =>
        dayjs(a.day, "DD/MM/YYYY").isAfter(dayjs(b.day, "DD/MM/YYYY")) ? 1 : -1
      );
      event[0].dates = [];
      event[0].dates.push(
        dayjs(event[0].start_date, "DD/MM/YYYY").format("YYYY-MM-DD")
      );
      event[0].dates.push(
        dayjs(event[0].c1_date, "DD/MM/YYYY").format("YYYY-MM-DD")
      );
      event[0].dates.push(
        dayjs(event[0].c_plus_1_date, "DD/MM/YYYY").format("YYYY-MM-DD")
      );
      event[0].dates.push(
        dayjs(event[0].finish_date, "DD/MM/YYYY").format("YYYY-MM-DD")
      );
      const user_json = await User.all();
      const user = user_json.toJSON();
      //#region Foreach с назначением С...
      documents.forEach((document) => {
        const date = dayjs(document.day, "DD/MM/YYYY");
        const start_date = dayjs(event[0].start_date, "DD/MM/YYYY");
        const c1_date = dayjs(event[0].c1_date, "DD/MM/YYYY");
        const c_plus_1_date = dayjs(event[0].c_plus_1_date, "DD/MM/YYYY");
        const finish_date = dayjs(event[0].finish_date, "DD/MM/YYYY");
        if (date.isSameOrAfter(start_date) && date.isBefore(c1_date)) {
          const diff =
            (c1_date.toDate().getTime() - date.toDate().getTime()) /
            (1000 * 3600 * 24);
          document.date = "C-" + diff;
        } else if (date.isSame(c1_date)) {
          document.date = "C1";
        } else if (date.isAfter(c1_date) && date.isBefore(c_plus_1_date)) {
          const diff =
            (date.add(1, "day").toDate().getTime() -
              c1_date.toDate().getTime()) /
            (1000 * 3600 * 24);
          document.date = "C" + diff;
        } else if (date.isSame(c_plus_1_date)) {
          document.date = "C+1";
        } else if (
          date.isAfter(c_plus_1_date) &&
          date.isSameOrBefore(finish_date)
        ) {
          const diff =
            (date.add(1, "day").toDate().getTime() -
              c_plus_1_date.toDate().getTime()) /
            (1000 * 3600 * 24);
          document.date = "C+" + diff;
        }

        var signer = user.filter((user) => {
          return document.signed_by === user.id;
        });
        if (signer[0]) {
          signer[0].fullname;
          document.signed_name = signer[0].fullname;
        }
      });
      //#endregion

      return response.status(200).json({
        documents,
        event,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка получения списка документов",
      });
    }
  }
  async saveDocument({ params, request, response }) {
    try {
      const id = params.id;
      const new_data = request.body.data;
      const document = await Document.query().where("id", id).firstOrFail();
      document.title = new_data.title;
      document.content = new_data.content;
      //т.к. метод юзается и пользователем, и админом - один метод на две страницы
      //и подписать юзером и изменить админом
      //у админа дата поступает вот такой
      document.day = dayjs(new_data.day, "YYYY-MM-DD").format("DD/MM/YYYY");
      document.destination = new_data.destination;
      if (
        new_data.signed == "true" &&
        new_data.signed_by != null &&
        document.signed_by == null
      ) {
        document.signed = true;
        document.signed_by = new_data.signed_by;
      }
      await document.save();
      return response.status(200).json({
        status: "success",
        data: document,
        message: "Данные документа " + document.title + " успешно изменены",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка изменения документа",
      });
    }
  }
  async newDocument({ request, response }) {
    try {
      const new_data = request.body.data;
      const documentData = {};
      documentData.title = new_data.title;
      documentData.day = new_data.day;
      documentData.content = new_data.content;
      documentData.destination = new_data.destination;
      documentData.event_id = new_data.event_id;
      const doc = await Document.create(documentData);
      return response.status(200).json({
        status: "success",
        message: "Документ " + documentData.title + " успешно создан",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка создания нового документа",
      });
    }
  }
  async deleteDocument({ params, response }) {
    try {
      const id = params.id;
      const document = await Document.query().where("id", id).firstOrFail();
      document.availability = "false";
      await document.save();
      return response.status(200).json({
        status: "success",
        message: "Документ " + document.title + " успешно удален",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: "Ошибка удаления документа",
      });
    }
  }
}

module.exports = DocumentController;
