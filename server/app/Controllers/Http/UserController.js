"use strict";

const base64Img = require("base64-img");
const Drive = use("Drive");
const Helpers = use("Helpers");
const User = use("App/Models/User");
const Country = use("App/Models/Country");
const Hash = use("Hash");
const Mail = use("Mail");
const dayjs = require("dayjs");

class UserController {
  async login({ request, auth, response }) {
    try {
      const token = await auth.attempt(
        request.input("email"),
        request.input("password")
      );
      return response.status(200).json({
        status: "success",
        data: token,
      });
    } catch (error) {
      response.status(401).json({
        status: "error",
        message: "Неверный логин/пароль",
      });
    }
  }

  async register({ request, auth, response }) {
    const userData = request.only([
      "firstname",
      "lastname",
      "email",
      "password",
      "country",
      "userpic",
    ]);
    try {
      userData["role"] = "no_role";
      if (userData.userpic != null) {
        const name = Date.now();
        base64Img.img(
          userData.userpic,
          `${Helpers.publicPath()}/userpic/`,
          name,
          function (err, filepath) {
            const pathArr = filepath.split("/");
            const fileName = pathArr[pathArr.length - 1];
          }
        );
        userData["userpic"] = name + ".jpg";
      } else {
        userData["userpic"] = "placeholder.png";
      }
      userData["about"] = "nothing yet";
      userData["date_of_reg"] = dayjs().format("DD/MM/YYYY");
      userData["confirmed"] = null;
      console.log("before reg");
      console.log(userData);
      const user = await User.create(userData);
      console.log("after reg");
      console.log(user);
      this.sendMail(user);
      const token = await auth.generate(user);
      return response.status(200).json({
        staus: "success",
        data: token,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: error,
      });
    }
  }
  async getAll({ response }) {
    try {
      const users = await User.all();
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

  async show({ params, response }) {
    const user = await User.find(params.id);
    const res = {
      username: user.username,
      email: user.email,
    };
    return response.json(res);
  }

  async me({ auth, response }) {
    try {
      const user = await User.query()
        .where("id", auth.current.user.id)
        .select()
        .firstOrFail();
      const country = await Country.find(user.country);
      user.country = country;

      return response.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Ошибка получения данных пользователя, попробуйте перезагрузить страницу (CTRL+F5)",
      });
    }
  }

  async verifyHash({ request, auth, response }) {
    try {
      const user = await User.query()
        .where("id", auth.current.user.id)
        .select()
        .firstOrFail();
      const isSame = await Hash.verify(request.body.data, user.password);
      return response.status(200).json({
        status: "success",
        data: isSame,
      });
    } catch (error) {
      return response.status(400).json({
        staus: "error",
        message: "Ошибка проверки пароля",
      });
    }
  }
  async verifyPin({ request, auth, response }) {
    try {
      const user = await User.query()
        .where("id", auth.current.user.id)
        .select()
        .firstOrFail();
      const isSame = request.body.data == user.PIN;
      return response.status(200).json({
        status: "success",
        data: isSame,
      });
    } catch (error) {
      return response.status(400).json({
        staus: "error",
        message: "Ошибка проверки пароля",
      });
    }
  }
  async uploadImage({ request, auth, response }) {
    try {
      const user = await User.query()
        .where("id", auth.current.user.id)
        .select()
        .firstOrFail();
      const file = request.body.data;
      const ext =
        file.substring("data:image/".length, file.indexOf(";base64")) == "jpeg"
          ? "jpg"
          : file.substring("data:image/".length, file.indexOf(";base64"));
      const name = Date.now();
      base64Img.img(
        file,
        `${Helpers.publicPath()}/userpic/`,
        name,
        function (err, filepath) {
          const pathArr = filepath.split("/");
          const fileName = pathArr[pathArr.length - 1];
        }
      );
      if (user.userpic != "placeholder.png")
        await Drive.delete(`${Helpers.publicPath()}/userpic/${user.userpic}`);
      user.userpic = name + "." + ext;
      await user.save();
      return response.status(200).json({
        data: user.userpic,
        status: "success",
        message: "Изображение профиля изменено",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Ошибка смены фото, попробуйте перезагрузить страницу (CTRL+F5)",
      });
    }
  }
  async deleteImage({ auth, response }) {
    try {
      const user = await User.query()
        .where("id", auth.current.user.id)
        .select()
        .firstOrFail();
      await Drive.delete(`${Helpers.publicPath()}/userpic/${user.userpic}`);
      user.userpic = "placeholder.png";
      await user.save();
      return response.status(200).json({
        status: "success",
        message: "Изображение профиля удалено",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Ошибка удаления фото, попробуйте перезагрузить страницу (CTRL+F5)",
      });
    }
  }
  async updateProfile({ request, auth, response }) {
    try {
      const user = await User.query()
        .where("id", auth.current.user.id)
        .select()
        .firstOrFail();
      const new_data = request.body.data;
      //login information
      if (user.password != new_data.password) {
        user.password = new_data.password;
        await user.save();
        const token = await auth.generate(user);
        return response.status(200).json({
          token: { data: token },
          data: user,
          status: "success",
          message: "Пароль изменен",
        });
      }
      //profile information
      else if (
        user.firstname != new_data.firstname ||
        user.lastname != new_data.lastname ||
        user.about != new_data.about ||
        user.country != new_data.country.id
      ) {
        user.firstname = new_data.firstname;
        user.lastname = new_data.lastname;
        user.about = new_data.about;
        user.country = new_data.country.id;
        await user.save();
        const country = await Country.find(user.country);
        user.country = country;
        return response.status(200).json({
          data: user,
          status: "success",
          message: "Персональные данные изменены",
        });
      }
      //pin information
      else if (user.PIN != new_data.PIN) {
        user.PIN = new_data.PIN;
        await user.save();
        return response.status(200).json({
          data: user,
          status: "success",
          message: "PIN изменен",
        });
      } else {
        return response.status(200).json({
          status: "warning",
          message: "Никаких изменений не обнаружено",
        });
      }
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Ошибка обновления данных профиля, попробуйте перезагрузить страницу (CTRL+F5)",
      });
    }
  }
  async deletePin({ auth, response }) {
    try {
      const user = await User.query()
        .where("id", auth.current.user.id)
        .select()
        .firstOrFail();
      user.PIN = "";
      await user.save();
      return response.status(200).json({
        status: "success",
        message: "PIN удален",
      });
    } catch (error) {
      return response.status(400).json({
        status: "error",
        message:
          "Ошибка смены пароля, попробуйте перезагрузить страницу (CTRL+F5)",
      });
    }
  }

  async sendMail(user) {
    const user_json = user.toJSON();
    await Mail.send("emails.welcome", { user: user_json }, (message) => {
      message.from("sender@xn--80aadqsd0ah9a8b.xn--p1ai");
      message.to("kirill.manov@list.ru");
      message.subject("One more very useful letter");
    });
  }
  async verifyMail({ params }) {
    const user = await User.findBy("id", params.id);
    user.confirmed = 1;
    await user.save();
  }
}

module.exports = UserController;
