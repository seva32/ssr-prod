import * as api from "./apiKeys";

export default (param) => {
  switch (param) {
    case api.MONGOOSE: return process.env.MONGOOSE;
    case api.PORT: return process.env.PORT;
    case api.REACT_APP_GOOGLE_ID: return process.env.REACT_APP_GOOGLE_ID;
    case api.TOKEN_SECRET: return process.env.TOKEN_SECRET;
    default:
      throw new Error(
        "You need to specify your tmdb api-key. You can do so by specifying "
            + "--env.apiKey=<yourkey> in the command line. For example:\n"
            + "$ npm run serve-dev  -- --env.apiKey=<yourkey>"
      );
  }
};
