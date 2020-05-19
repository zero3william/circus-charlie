export default (store) => ({
  path: "game",
  getComponent(nextState, cb) {
    require.ensure(
      [],
      (require) => {
        const Container = require("./containers/container").default;
        cb(null, Container);
      },
      "game"
    );
  },
});
