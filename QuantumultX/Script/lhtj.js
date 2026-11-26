/***********************************
[rewrite_local]
^https?:\/\/gw2c-hw-open\.longfor\.com\/lmarketing-task-api-mvc-prod\/openapi\/task\/v1\/signature\/clock url script-request-header https://raw.githubusercontent.com/Brucents/Rule_Config/master/QuantumultX/Script/lhtj.js

[mitm]
hostname = gw2c-hw-open.longfor.com
***********************************/

/*
 * Quantumult X 龙湖天街 Cookie 采集并同步到青龙
 *
 * Cookie 仅在本次运行内存中处理并直接上传，不写入 QuanX 本地存储。
 * 青龙连接配置保存在 QuanX 本地偏好键 lhtj_ql_config，不写入脚本文件：
 * {"baseUrl":"https://你的面板地址:5700","clientId":"应用ID","clientSecret":"应用密钥"}
 * 此脚本会把账号数组写入青龙环境变量 lhtj_data，供 ql_lhtj.py 使用。
 */

const ENV_NAME = "lhtj_data";
const QL_CONFIG_KEY = "lhtj_ql_config";
let QL = null;

function parseUsers(raw) {
  if (!raw) return [];
  const users = JSON.parse(raw);
  if (!Array.isArray(users)) throw new Error(`${ENV_NAME} 内容不是账号数组`);
  return users;
}

function getAccount(headers) {
  const normalized = {};
  for (const [key, value] of Object.entries(headers || {})) {
    normalized[key.toLowerCase()] = value;
  }
  if (!normalized.cookie) throw new Error("请求头中没有 Cookie，请确认已完成登录并触发签到请求");

  return {
    userName: "微信用户",
    "x-lf-dxrisk-token": normalized["x-lf-dxrisk-token"] || "",
    "x-lf-channel": normalized["x-lf-channel"] || "",
    token: normalized.token || "",
    "x-lf-usertoken": normalized["x-lf-usertoken"] || "",
    cookie: normalized.cookie,
    "x-lf-bu-code": normalized["x-lf-bu-code"] || "",
    "x-lf-dxrisk-source": normalized["x-lf-dxrisk-source"] || "",
  };
}

function upsertAccount(users, account) {
  const index = users.findIndex((item) =>
    (account.token && item.token === account.token) || item.cookie === account.cookie
  );
  if (index < 0) users.push(account);
  else users[index] = account;
  return users;
}

function loadQlConfig() {
  const raw = $prefs.valueForKey(QL_CONFIG_KEY);
  if (!raw) return null;
  const config = JSON.parse(raw);
  if (!config.baseUrl || !config.clientId || !config.clientSecret) return null;
  if (!/^https?:\/\//i.test(config.baseUrl)) throw new Error("青龙面板地址需包含 http:// 或 https://");
  return config;
}

async function qlRequest(path, method, token, body) {
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const options = {
    url: `${QL.baseUrl.replace(/\/+$/, "")}${path}`,
    method,
    headers,
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await $task.fetch(options);
  const status = Number(response.statusCode || response.status || 0);
  if (status < 200 || status >= 300) {
    const endpoint = `${QL.baseUrl.replace(/\/+$/, "")}${path.split("?")[0]}`;
    const hint = status === 404 ? "；检查面板根地址、反向代理前缀和 Open API 路径" : "";
    throw new Error(`青龙接口 ${endpoint} 返回 HTTP ${status || "未知"}${hint}`);
  }

  let result;
  try {
    result = JSON.parse(response.body || "{}");
  } catch (_) {
    throw new Error("青龙 API 返回的内容不是 JSON");
  }
  if (result.code !== undefined && ![0, 200].includes(Number(result.code))) {
    throw new Error(`青龙 API 返回错误：${result.message || result.code}`);
  }
  return result;
}

async function syncToQingLong(account) {
  const authUrl = "/open/auth/token?client_id=" + encodeURIComponent(QL.clientId) +
    "&client_secret=" + encodeURIComponent(QL.clientSecret);
  const auth = await qlRequest(authUrl, "GET");
  const accessToken = auth.data && auth.data.token;
  if (!accessToken) throw new Error("青龙没有返回 API 访问令牌，请检查应用凭据和面板地址");

  const query = "/open/envs?searchValue=" + encodeURIComponent(ENV_NAME);
  const envResult = await qlRequest(query, "GET", accessToken);
  const envs = Array.isArray(envResult.data) ? envResult.data :
    (Array.isArray(envResult.data && envResult.data.data) ? envResult.data.data : []);
  const existing = envs.find((env) => env.name === ENV_NAME);
  const users = upsertAccount(parseUsers(existing ? existing.value : ""), account);
  const env = {
    name: ENV_NAME,
    value: JSON.stringify(users),
    remarks: existing && existing.remarks ? existing.remarks : "QuanX 龙湖天街账号",
  };

  if (existing) {
    if (existing.id === undefined) throw new Error("青龙环境变量响应中没有 id，无法安全更新");
    env.id = existing.id;
    await qlRequest("/open/envs", "PUT", accessToken, env);
  } else {
    await qlRequest("/open/envs", "POST", accessToken, [env]);
  }
  return users.length;
}

async function main() {
  if (typeof $request === "undefined" || $request.method === "OPTIONS") {
    $done({});
    return;
  }

  let account;
  let localUsers;
  try {
    account = getAccount($request.headers);
    localUsers = upsertAccount(parseUsers($prefs.valueForKey(ENV_NAME)), account);
    if (!$prefs.setValueForKey(JSON.stringify(localUsers), ENV_NAME)) {
      throw new Error("Cookie 本地保存失败，请检查 QuanX 存储空间");
    }
  } catch (error) {
    $notify("龙湖天街 Cookie", "采集或本地保存失败", error.message || "请检查请求头和本地存储");
    $done({});
    return;
  }

  try {
    QL = loadQlConfig();
  } catch (error) {
    $notify("龙湖天街 Cookie", "本地已保存，青龙配置无效", error.message || "请检查 lhtj_ql_config");
    $done({});
    return;
  }

  if (!QL) {
    $notify("龙湖天街 Cookie", "本地保存成功", `已保存到本地变量 ${ENV_NAME}；请设置 ${QL_CONFIG_KEY} 后同步青龙`);
    $done({});
    return;
  }

  try {
    const count = await syncToQingLong(account);
    $notify("龙湖天街 Cookie", "本地和青龙同步成功", `本地变量 ${ENV_NAME} 已保存；青龙变量已更新，共 ${count} 个账号`);
  } catch (error) {
    $notify("龙湖天街 Cookie", "本地保存成功，青龙上传失败", `${error.message || "请检查面板地址、应用凭据和 API 权限"}`);
  }
  $done({});
}

main();
