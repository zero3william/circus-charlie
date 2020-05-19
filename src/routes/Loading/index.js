export default (store) => ({
  getComponent(nextState, cb) {
    require.ensure(
      [],
      (require) => {
        const Container = require("./containers/container").default;
        cb(null, Container);
      },
      "loading"
    );
  },
});
