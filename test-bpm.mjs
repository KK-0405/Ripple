import { ProxyAgent, fetch as undiciFetch } from "undici";

const API_KEY = "e1ca5255bf19947d06b3059328f9a4c0";
const proxyAgent = new ProxyAgent("http://172.16.71.1:3128");

const res = await undiciFetch(
  `https://api.getsongbpm.com/search/?api_key=${API_KEY}&type=both&lookup=song:Watercolour+artist:Pendulum`,
  { dispatcher: proxyAgent }
);

const data = await res.json();
console.log(JSON.stringify(data, null, 2));