// 触发方式：event-network（网络变化事件）
// 作用：触发后先切到直连模式，再切回规则模式。

// 定义一个函数来切换运行模式
function setRunningMode(mode) {
  const message = {
    action: "set_running_mode",
    content: { running_mode: mode }
  };
  return $configuration.sendMessage(message);
}

// 先切到直连模式
setRunningMode("all_direct")
  .then(() => {
    console.log("[INFO] 已切换到直连模式");
    // 切换回规则模式
    return setRunningMode("filter");
  })
  .then(() => {
    console.log("[INFO] 已切换到规则模式");
    $notify("🔔 网络变化", "", "✅ 您已重新接入网络");
  })
  .finally(() => {
    $done();
  });
