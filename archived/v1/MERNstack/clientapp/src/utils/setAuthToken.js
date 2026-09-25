import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // add to every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // remove auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
