import { TOKEN_SECRET } from "../../src/utils/getKey/apiKeys";
import getKey from "../../src/utils/getKey/getKey";

export default {
  secret: getKey(TOKEN_SECRET) || "tokentopsecret",
};
