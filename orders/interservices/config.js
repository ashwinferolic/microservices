const axios = require("axios");

const axiosUserAPI = axios.create({
  baseURL: process.env.USER_SERVER,
});

const axiosProductAPI = axios.create({
  baseURL: process.env.PRODUCT_SERVER,
});

const API = {
  getUser: async function (id) {
    try {
      let res = await axiosUserAPI({
        method: "get",
        url: `/details/${id}`,
      });
      return res.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
  getProduct: async function (id) {
    try {
      let res = await axiosProductAPI({
        method: "get",
        url: `/details/${id}`,
      });
      return res.data;
    } catch (error) {
      return error?.response?.data;
    }
  },
};

module.exports = { axiosUserAPI, axiosProductAPI, API };
