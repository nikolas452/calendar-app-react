const baseUrl = process.env.REACT_APP_API_URL;

const fetchSinToken = (endpoint, data, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`;

  if (method === "GET") return fetch(url).then((res) => res.stringify());
  else
    return fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.stringify());
};

const fetchContToken = (endpoint, data, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`;
  const token = localStorage.getItem("token") || "";
  if (method === "GET")
    return fetch(url, { method, headers: { "x-token": token } }).then((res) =>
      res.stringify()
    );
  else
    return fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        "x-token": token,
      },
      body: JSON.stringify(data),
    }).then((res) => res.stringify());
};

export { fetchSinToken, fetchContToken };
