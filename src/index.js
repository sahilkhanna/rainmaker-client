import Swagger from "swagger-client";
const OPENAPI_URL =
  "https://swaggerapis.rainmaker.espressif.com/Rainmaker_Swagger.yaml";

const requestInterceptor = (request) => {
  console.log(request);
  return request;
};
class RainMaker {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    if (this.username === undefined || this.password === undefined) {
      throw new Error("One or all Credentials are undefined");
    }
    this.apiClient = null;
  }
  async getApiFunctions() {
    if (this.apiClient) {
      return { status: 200, result: this.apiClient.apis };
    } else {
      return { status: 400, result: "No Client resolved" };
    }
  }
  async authenticate() {
    const credentials = {
      user_name: this.username,
      password: this.password,
    };
    const apiClient = await Swagger({
      url: OPENAPI_URL,
      responseContentType: "application/json",
      authorizations: { AccessToken: "" },
    });
    try {
      const response = await apiClient.apis.User.login(
        { version: "v1" },
        {
          requestBody: credentials,
        }
      );
      this.apiClient = await Swagger({
        url: OPENAPI_URL,
        responseContentType: "application/json",
        authorizations: { AccessToken: response.body.accesstoken },
      });
      return { status: response.status, result: "Authentication Successful" };
    } catch (error) {
      return { status: error.response.status, result: error.response.body };
    }
  }
  checkClient() {
    if (!this.apiClient) {
      return { status: 400, result: "Client Failed" };
    }
  }
  async getUserNodes(detailed = false) {
    this.checkClient();
    try {
      const response = await this.apiClient.apis[
        "User Node Association"
      ].getUserNodes({ version: "v1", node_details: detailed });
      return { status: response.status, result: response.body };
    } catch (error) {
      return { status: error.status, result: error.response.body };
    }
  }
  async getTimeSeriesData(node, param, startTime, endTime, next_id, interval) {
    this.checkClient();
    try {
      const response = await this.apiClient.apis["Time Series Data"].GetTSData({
        version: "v1",
        node_id: node,
        param_name: param,
        type: "float",
        aggregate: "raw",
        start_time: startTime,
        end_time: endTime,
        start_id: next_id,
        num_records: interval ? interval : 200,
      });
      return { status: response.status, result: response.body };
    } catch (error) {
      return { status: error.status, result: error };
    }
  }
  async getAllNodeParams(node) {
    this.checkClient();
    try {
      const response = await this.apiClient.apis[
        "Node Parameter Operations"
      ].getnodestate({
        version: "v1",
        node_id: node,
      });
      return { status: response.status, result: response.body };
    } catch (error) {
      return { status: error.status, result: error };
    }
  }
  async setNodeParamValue(node, device, param, value) {
    this.checkClient();
    const reqBody = [
      {
        node_id: node,
        payload: {
          [device]: {
            [param]: value,
          },
        },
      },
    ];
    try {
      const response = await this.apiClient.apis[
        "Node Parameter Operations"
      ].updatenodestate(
        {
          version: "v1",
        },
        {
          requestBody: reqBody,
          requestInterceptor,
        }
      );
      return { status: response.status, result: response.body };
    } catch (error) {
      return { status: error.status, result: error };
    }
  }
}

module.exports = RainMaker;
