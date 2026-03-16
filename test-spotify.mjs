import { ProxyAgent, fetch } from "undici";

const CLIENT_ID = "c499110d5bc94e9190744b34198d57a4";
const CLIENT_SECRET = "6f7a9eeacd8a44ca9bce37a92a187f75";

const proxyAgent = new ProxyAgent("http://172.16.71.1:3128");

const response = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " +
      Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
  },
  body: "grant_type=client_credentials",
  dispatcher: proxyAgent,
});

const data = await response.json();
console.log(data);