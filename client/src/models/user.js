export default class User {
  constructor(
    firstname,
    lastname,
    email,
    country,
    userpic,
    password,
    role,
    about,
    pin,
    event_id,
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.country = country;
    this.userpic = userpic;
    this.password = password;
    this.role = role;
    this.about = about;
    this.pin = pin;
    this.event_id = event_id;
  }
}
