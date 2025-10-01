// 全局变量定义
var c = 0,
  t,
  add = [],
  sec,
  f = 0,
  m = 0;
var tm = false;

// DOM 元素获取工具函数
function $(id) {
  return document.getElementById(id);
}

// 定时抽取数字函数
function timedCount(numarr) {
  var node = $("out"),
    rn = Math.floor(Math.random() * numarr.length);
    
  node.style.color = "rgb(var(--mdui-color-primary))";
  node.style.opacity = "0.5";
  node.innerHTML = numarr[rn];
  c++;
  
  // 检查是否达到停止条件
  if (new Date().getTime() - sec > $("settime").value || m) {
    stopCount();
    c = 0;
    m = 0;
    node.style.color = "rgb(var(--mdui-color-primary))";
    node.style.opacity = "1";

    // 添加到历史记录
    const historyList = document.getElementById("history-list");
    const newChip = document.createElement("mdui-chip");
    newChip.textContent = numarr[rn];
    newChip.style.margin = "4px";
    historyList.appendChild(newChip);

    add.push(numarr[rn]);
    document.querySelector("#notes span").innerHTML = add.join(", ");
  } else {
    t = setTimeout(() => timedCount(numarr), 50);
  }
}

// 设备运动事件处理（注：需补充 x/y/z/lastX/lastY/lastZ/speed/sy/zd/last_update 的声明）
function motionEventHandler(e) {
  var acceleration = e.accelerationIncludingGravity;
  x = acceleration.x;
  y = acceleration.y;
  z = acceleration.z;
  
  if (
    Math.abs(x - lastX) > speed ||
    Math.abs(y - lastY) > speed ||
    Math.abs(z - lastZ) > speed
  ) {
    var curTime = new Date().getTime();
    if (!c && curTime - last_update > 500) {
      last_update = curTime;
      if (sy) $("audio").play();
      if (zd) window.navigator.vibrate(200);
      getNum();
    }
  }
  lastX = x;
  lastY = y;
  lastZ = z;
}

// 停止计数函数
function stopCount() {
  clearTimeout(t);
}

// 获取随机数主函数
function getNum() {
  var manual = $("manual").checked;
  if (c) {
    if (manual) m = 1;
    return;
  }
  m = 0;
  
  var nr = $("num").value,
    excludeStr = getExcludedNumbersFromStorage($("set-exclude-label").value),
    out = $("out");

  // 范围变化时清空历史记录
  if (sessionStorage.getItem("randomIn") != nr) {
    sessionStorage.setItem("randomIn", nr);
    add = [];
  }

  // 验证输入格式
  if (!/^\d{1,6}-\d{1,6}$/.test(nr)) return openErrorDialog();

  // 解析数字范围
  arr = nr.split("-").map(Number);
  let in0 = Math.min(arr[0], arr[1]);
  let in1 = Math.max(arr[0], arr[1]);
  out.innerHTML = in0 === in1 ? in0 : "";

  // 显示排除数字
  const excludeList = document.getElementById("exclude-list");
  excludeList.innerHTML = "";
  excludeStr.forEach((num) => {
    const newChip = document.createElement("mdui-chip");
    newChip.textContent = num;
    newChip.style.margin = "4px";
    excludeList.appendChild(newChip);
  });

  // 生成可用数字数组
  numarr = [];
  for (let i = in0; i <= in1; i++) {
    if (!$("repeat").checked || !add.includes(i)) {
      if (!excludeStr.includes(i)) {
        numarr.push(i);
      }
    }
  }

  // 检查是否有可用数字
  if (numarr.length == 0) {
    add = [];
    window.removeEventListener("devicemotion", motionEventHandler, false);
    out.style.color = "rgb(var(--mdui-color-primary))";
    out.innerHTML = "Done";
    return;
  }

  // 开始抽取
  sec = new Date().getTime();
  if (manual) sec += 1000 * 60 * 60 * 24 * 7;
  timedCount(numarr);
}

// 键盘事件处理
document.onkeydown = function (e) {
  var keyCode = window.event ? e.keyCode : e.which;
  if ((13 == keyCode || 32 == keyCode) && f == 0) {
    getNum();
    $("num").blur();
    return false;
  }
};

// 时间设置函数
function settime(vs, vx) {
  if (tm) return;
  setTimeout(function () {
    vx += 50;
    if (vx > vs) vx = vs;
    if (vx < vs) settime(vs, vx);
  }, 50);
}

// 本地存储处理
function storage(n) {
  if (n) {
    if (localStorage.getItem("suijishu")) {
      var settings = JSON.parse(localStorage.getItem("suijishu"));
      if ("settime" in settings) {
        $("settime").value = settings.settime;
        settime(settings.settime, 0);
      }
      if ("repeat" in settings)
        $("repeat").checked = settings.repeat == 1 ? true : false;
      if ("manual" in settings) {
        $("manual").checked = settings.manual == 1 ? true : false;
        manuald();
      }
    }
  }
  var setting = new Object();
  setting.settime = $("settime").value;
  setting.repeat = $("repeat").checked ? 1 : 0;
  setting.manual = $("manual").checked ? 1 : 0;
  localStorage.setItem("suijishu", JSON.stringify(setting));
}

// 手动模式处理
function manuald() {
  var check = $("manual").checked;
  $("timeout").style.display = "inline-block";
  if (!check) {
    m = 0;
    sec = new Date().getTime();
  }
}

// 设置下拉框选中项
function setSelectChecked(id, val) {
  var node = $(id),
    i = 0;
  for (; i < node.options.length; i++) {
    if (node.options[i].value == val) {
      node.options[i].selected = true;
      break;
    }
  }
}

// 从本地存储获取排除数字
function getExcludedNumbersFromStorage(labelValue) {
  if (!localStorage.getItem("excludeLabels")) return [];
  var labels = JSON.parse(localStorage.getItem("excludeLabels"));
  return labels[labelValue] || [];
}

// 保存排除标签
function saveExcludeLabel() {
  const labelName = $("exclude-label-name").value;
  const excludeStr = $("excludeNums").value;
  if (!labelName || !excludeStr) return;

  var labels = localStorage.getItem("excludeLabels")
    ? JSON.parse(localStorage.getItem("excludeLabels"))
    : {};
  labels[labelName] = excludeStr
    .split(",")
    .map((num) => num.trim())
    .filter((num) => num)
    .map(Number);
  localStorage.setItem("excludeLabels", JSON.stringify(labels));

  const select = $("set-exclude-label");
  const newMenuItem = document.createElement("mdui-menu-item");
  newMenuItem.value = labelName;
  newMenuItem.textContent = labelName;
  select.appendChild(newMenuItem);

  $("exclude-label-name").value = "";
  $("excludeNums").value = "";
  showSettingsSavedSnackbar();
}

// 页面加载完成处理
window.onload = function () {
  const loading = document.querySelector(".loading");
  loading.style.display = "none";

  // 加载保存的排除标签
  var excludeLabels = localStorage.getItem("excludeLabels");
  if (excludeLabels) {
    excludeLabels = JSON.parse(excludeLabels);
    const select = $("set-exclude-label");
    for (let label in excludeLabels) {
      const newMenuItem = document.createElement("mdui-menu-item");
      newMenuItem.value = label;
      newMenuItem.textContent = label;
      select.appendChild(newMenuItem);
    }
  }

  // 加载其他设置
  storage(1);
};

// -------------------------- 核心修复：底部栏拖拽功能 --------------------------
document.addEventListener("DOMContentLoaded", () => {
  const bottomBar = document.querySelector(".dragBar");
  let isDragging = false;
  let offset = { x: 0, y: 0 };

  // 关键：判断触摸目标是否为 mdui-fab（或其内部元素）
  function isFabTarget(target) {
    // 检查目标元素本身或其祖先是否包含 mdui-fab 类
    return target.closest(".mdui-fab") !== null;
  }

  // 处理开始事件（触摸/鼠标按下）
  function handleStart(e) {
    // 1. 触摸事件：优先判断是否点击 mdui-fab
    if (e.type === "touchstart") {
      const touchTarget = e.touches[0].target; // 获取触摸的实际元素
      if (isFabTarget(touchTarget)) {
        return; // 是 fab 元素，不执行拖动逻辑，保留点击事件
      }
    }

    // 2. 鼠标事件：判断是否点击 mdui-fab（可选，防止鼠标点击也被拦截）
    if (e.type === "mousedown" && isFabTarget(e.target)) {
      return; // 是 fab 元素，不执行拖动逻辑
    }

    // 3. 非 fab 元素，执行拖动初始化
    e.preventDefault(); // 仅在非 fab 时阻止默认行为
    isDragging = true;

    // 获取鼠标/触摸位置（兼容两种事件）
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    // 计算偏移量（元素左上角到触摸点的距离，确保拖动不跳动）
    offset = {
      x: bottomBar.offsetLeft - clientX,
      y: bottomBar.offsetTop - clientY,
    };
  }

  // 处理移动事件（触摸/鼠标移动）
  function handleMove(e) {
    if (!isDragging) return; // 未处于拖动状态，直接返回
    e.preventDefault(); // 阻止页面滚动，确保拖动流畅

    // 获取当前触摸/鼠标位置
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    // 更新 bottomBar 位置（偏移量 + 当前位置 = 元素新位置）
    bottomBar.style.left = `${clientX + offset.x}px`;
    bottomBar.style.top = `${clientY + offset.y}px`;
  }

  // 处理结束事件（触摸/鼠标释放）
  function handleEnd() {
    isDragging = false; // 重置拖动状态
  }

  // 绑定鼠标事件（兼容桌面端）
  bottomBar.addEventListener("mousedown", handleStart);
  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleEnd);

  // 绑定触摸事件（兼容移动端，关键修复）
  bottomBar.addEventListener("touchstart", handleStart); // 触摸开始时判断目标
  document.addEventListener("touchmove", handleMove, { passive: false }); // passive: false 允许 preventDefault
  document.addEventListener("touchend", handleEnd);
});

// 对话框和通知功能
function openErrorDialog() {
  notice("错误：抽取范围格式不正确。");
}

function openBlockDialog() {
  const blockDialog = document.querySelector(".block-dialog");
  const closeButton2 = blockDialog.querySelector(".close-block-dialog");

  blockDialog.open = true;
  closeButton2.addEventListener("click", () => (blockDialog.open = false));
}

function copyToClipboard1() {
  const outContent = document.getElementById("out").innerText;

  navigator.clipboard
    .writeText(outContent)
    .then(() => notice("复制内容成功。"))
    .catch((err) => notice("错误：无法复制内容。"));
}

function copyToClipboard2() {
  const notesContent = document.getElementById("notes").innerText;

  navigator.clipboard
    .writeText(notesContent)
    .then(() => notice("复制内容成功。"))
    .catch((err) => notice("错误：无法复制内容。"));
}

function showSettingsSavedSnackbar() {
  notice("设置已保存。");
}