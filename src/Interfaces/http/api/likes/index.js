const Likeshandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  register: async (server, { container }) => {
    const likesHandler = new Likeshandler(container);
    server.route(routes(likesHandler));
  },
};
