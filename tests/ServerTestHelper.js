/* istanbul ignore file */

const createServer = require('../src/Infrastructures/http/createServer');
const container = require('../src/Infrastructures/container');

const ServerTestHelper = {
  async getAccessToken() {
    const registerUserPayload = {
      username: 'adikchristian',
      password: 'rahasiabgt',
      fullname: 'Adi Christian',
    };

    const loginPayload = {
      username: 'adikchristian',
      password: 'rahasiabgt',
    };

    const server = await createServer(container);
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: registerUserPayload,
    });

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: loginPayload,
    });

    const responseJson = JSON.parse(response.payload);
    return responseJson.data.accessToken;
  },
};

module.exports = ServerTestHelper;
