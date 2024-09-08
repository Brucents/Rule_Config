// Define the `main` function

function main(params) {

    // 香港地区
    const hongKongRegex = /香港|HK|Hong|🇭🇰/;
    const hongKongProxies = params.proxies
        .filter((e) => hongKongRegex.test(e.name))
        .map((e) => e.name);
    // 台湾地区
    const taiwanRegex = /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/;
    const taiwanProxies = params.proxies
        .filter((e) => taiwanRegex.test(e.name))
        .map((e) => e.name);
    // 狮城地区
    const singaporeRegex = /新加坡|狮城|SG|Singapore|🇸🇬/;
    const singaporeProxies = params.proxies
        .filter((e) => singaporeRegex.test(e.name))
        .map((e) => e.name);
    // 日本地区
    const japanRegex = /日本|JP|Japan|🇯🇵/;
    const japanProxies = params.proxies
        .filter((e) => japanRegex.test(e.name))
        .map((e) => e.name);
    // 美国地区
    const americaRegex = /美国|US|United States|America|🇺🇸/;
    const americaProxies = params.proxies
        .filter((e) => americaRegex.test(e.name))
        .map((e) => e.name);
    // 其他地区
    const othersRegex = /香港|HK|Hong|🇭🇰|台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼|新加坡|SG|Singapore|狮城|🇸🇬|日本|JP|Japan|🇯🇵|美国|US|States|America|🇺🇸|自动|故障|流量|官网|套餐|机场|订阅|年|月/;
    const othersProxies = params.proxies
        .filter((e) => !othersRegex.test(e.name))
        .map((e) => e.name);
    // 所有地区
    const allRegex = /自动|故障|流量|官网|套餐|机场|订阅|年|月/;
    const allProxies = params.proxies
        .filter((e) => !allRegex.test(e.name))
        .map((e) => e.name);

    // 香港
    const HongKong = {
        name: "HongKong",
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png",
        interval: 300,
        tolerance: 20,
        timeout: 2000,
        lazy: true,
        proxies: hongKongProxies.length > 0 ? hongKongProxies : ["DIRECT"]
    };
    // 台湾
    const TaiWan = {
        name: "TaiWan",
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png",
        interval: 300,
        tolerance: 20,
        timeout: 2000,
        lazy: true,
        proxies: taiwanProxies.length > 0 ? taiwanProxies : ["DIRECT"]
    };
    // 狮城
    const Singapore = {
        name: "Singapore",
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png",
        interval: 300,
        tolerance: 20,
        timeout: 2000,
        lazy: true,
        proxies: singaporeProxies.length > 0 ? singaporeProxies : ["DIRECT"]
    };
    // 日本
    const Japan = {
        name: "Japan",
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png",
        interval: 300,
        tolerance: 20,
        timeout: 2000,
        lazy: true,
        proxies: japanProxies.length > 0 ? japanProxies : ["DIRECT"]
    };
    // 美国
    const America = {
        name: "America",
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png",
        interval: 300,
        tolerance: 20,
        timeout: 2000,
        lazy: true,
        proxies: americaProxies.length > 0 ? americaProxies : ["DIRECT"]
    };
    // 其他
    const Others = {
        name: "Others",
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/World_Map.png",
        interval: 300,
        tolerance: 20,
        timeout: 2000,
        lazy: true,
        proxies: othersProxies.length > 0 ? othersProxies : ["DIRECT"]
    };
    // 自动
    const Auto = {
        name: "Auto",
        type: "url-test",
        url: "http://www.gstatic.com/generate_204",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Auto.png",
        interval: 300,
        tolerance: 20,
        timeout: 2000,
        lazy: true,
        proxies: allProxies.length > 0 ? allProxies : ["DIRECT"]
    };
    // 负载均衡-轮询
    const Balance = {
        name: "Balance",
        type: "load-balance",
        url: "http://www.gstatic.com/generate_204",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Available.png",
        interval: 300,
        strategy: "round-robin",
        // strategy: "consistent-hashing",
        lazy: true,
        proxies: allProxies.length > 0 ? allProxies : ["DIRECT"]
    };
    // 故障转移
    const Fallback = {
        name: "Fallback",
        type: "fallback",
        url: "http://www.gstatic.com/generate_204",
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Bypass.png",
        interval: 300,
        timeout: 2000,
        lazy: true,
        proxies: allProxies.length > 0 ? allProxies : ["DIRECT"]
    };

    // 国外分组
    const G = ["Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"];

    // 漏网之鱼
    const Final = {
        name: "Final",
        type: "select",
        proxies: ["DIRECT", "Global", "Proxy"],
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Final.png"
    };
    // 手动选择
    const Proxy = {
        name: "Proxy",
        type: "select",
        proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Proxy.png"
    };
    // 国外网站
    const Global = {
        name: "Global",
        type: "select",
        proxies: G,
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png"
    };



    // 插入分组
    const groups = params["proxy-groups"] = [];
    groups.unshift(HongKong, TaiWan, Japan, Singapore, America, Others, Auto, Balance, Fallback);
    groups.unshift(Final, Proxy, Global);

    // 规则
    const rules = [
        "MATCH,Final"
    ];
    // 插入规则
    params.rules = rules;
    return params;
}