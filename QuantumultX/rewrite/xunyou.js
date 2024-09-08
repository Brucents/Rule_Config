/***********************************
 [rewrite_local]
 https:\/\/dss-m\.xywlhlh\.com\/site-api\/mobile\/flow\/recharge\/\d+\/product url script-response-body https://raw.githubusercontent.com/Brucents/Proxy_Config/main/QuantumultX/rewrite/xunyou.js
 https:\/\/dss-m\.xywlhlh\.com\/site-api\/mobile\/member\/info url script-response-body https://raw.githubusercontent.com/Brucents/Proxy_Config/main/QuantumultX/rewrite/xunyou.js

 [mitm]
 hostname=dss-m.xywlhlh.com
 ***********************************/

let xunyou = JSON.parse($response.body);



if ($request.url.includes("/product")) {
    if ("组合支付" === xunyou["payMethodDesc"]) {
        console.log("可以支付")
    } else {
        console.log("支付异常，开始更改")
        xunyou["payMethodDesc"] = "组合支付"
        xunyou["payMethod"] = "5"
        xunyou["purchaseLimitSwitch"] = "0"
        xunyou["purchaseLimitSwitchDesc"] = "关闭"
        xunyou["couponSwitch"] = 1
    }
} else if ($request.url.includes("/member/info")) {
    xunyou["list"][0]["defaultSelect"] = 0
    xunyou["list"][0]["defaultSelectDesc"] = "不选中"
    console.log("取消勾选加速包")
}
$done({body: JSON.stringify(xunyou),});