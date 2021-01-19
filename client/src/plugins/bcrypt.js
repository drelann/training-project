import bcryptjs from '../../node_modules/bcryptjs';

Object.defineProperties(Vue.prototype, {
  $bcryptjs: {
    get() {
      return bcryptjs;
    },
  },
});
