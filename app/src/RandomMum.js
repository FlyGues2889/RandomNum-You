var c = 0,
  t,
  add = [],
  sec,
  f = 0,
  m = 0;

function $(id) {
  return document.getElementById(id);
}

function timedCount(numarr) {
  var node = $("out"),
    rn = Math.floor(Math.random() * numarr.length);
  node.style.color = "rgb(var(--mdui-color-primary))"; // 修改为变量值
  node.style.opacity = "0.5"; // 设置透明度为0.5
  node.innerHTML = numarr[rn];
  c = c + 1;
  if (new Date().getTime() - sec > $("settime").value || m) {
    stopCount();
    c = 0;
    m = 0;
    node.style.color = "rgb(var(--mdui-color-primary))"; // 修改为变量值
    node.style.opacity = "1"; // 设置透明度为1

    // 为每个已抽到的数字创建一个mdui-chip元素
    const historyList = document.getElementById("history-list");
    const newChip = document.createElement("mdui-chip");
    
    newChip.textContent = numarr[rn];
    newChip.selectable = true;
    newChip.style.margin = "4px";
    historyList.appendChild(newChip);

    add.push(numarr[rn]);
    document.querySelector("#notes span").innerHTML = add.join(", ");
    document.querySelector("#notes b").innerHTML = add.length;
  } else {
    t = setTimeout(function () {
      timedCount(numarr);
    }, 50); // 使用函数而不是字符串
  }
}

function stopCount() {
  clearTimeout(t);
}

function stopCount() {
  clearTimeout(t);
}

function getNum() {
    var manual = $("manual").checked;
    if (c) {
        if (manual) m = 1;
        return; 
    }
    m = 0;
    var nr = $("num").value,
        excludeStr = $("excludeNums").value, // 获取排除的数字
        out = $("out");

    // 清空历史记录
    if (sessionStorage.getItem("randomIn") != nr) {
        sessionStorage.setItem("randomIn", nr);
        add = [];
    }

    const errorSnackbar = document.querySelector(".errorSnackbar");
    if (!/^\d{1,6}-\d{1,6}$/.test(nr)) return (errorSnackbar.open = true);

    arr = nr.split("-").map(Number);
    let in0 = Math.min(arr[0], arr[1]);
    let in1 = Math.max(arr[0], arr[1]);
    out.innerHTML = in0 === in1 ? in0 : "";

    // 处理排除数字
    let excludedNumbers = excludeStr.split(",").map(num => num.trim()).filter(num => num).map(Number);
    
    // 清空当前的排除数字列表
    const excludeList = document.getElementById('exclude-list');
    excludeList.innerHTML = '';

    // 将排除的数字添加到 mdui-chip 中
    excludedNumbers.forEach(num => {
        const newChip = document.createElement('mdui-chip');
        newChip.textContent = num;
        // newChip.selectable = true;
        newChip.style.margin = "4px";
        excludeList.appendChild(newChip);
    });

    numarr = [];
    for (let i = in0; i <= in1; i++) {
        // 如果未勾选不重复，则直接添加到 numarr
        if (!$("repeat").checked || !add.includes(i)) {
            // 如果该数字不在排除列表中，则添加
            if (!excludedNumbers.includes(i)) {
                numarr.push(i);
            }
        }
    }

    if (numarr.length == 0) {
        add = [];
        window.removeEventListener("devicemotion", motionEventHandler, false);
        out.style.color = "rgb(var(--mdui-color-primary))"; 
        out.innerHTML = "Done";
        return;
    }

    sec = new Date().getTime();
    if (manual) sec += 1000 * 60 * 60 * 24 * 7;
    timedCount(numarr);
}

document.onkeydown = function (e) {
  var keyCode = window.event ? e.keyCode : e.which;
  if ((13 == keyCode || 32 == keyCode) && f == 0) {
    getNum();
    $("num").blur();
    return false;
  }
};

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

var tm = false;

function settime(vs, vx) {
  if (tm) return;
  setTimeout(function () {
    vx += 50;
    if (vx > vs) vx = vs;
    $("time").innerHTML = (vx * 0.001).toFixed(2);
    if (vx < vs) settime(vs, vx);
  }, 50);
}

function storage(n) {
  if (n) {
    if (localStorage.getItem("suijishu")) {
      var settings = JSON.parse(localStorage.getItem("suijishu"));
      if ("settime" in settings) {
        $("settime").value = settings.settime;
        settime(settings.settime, 0);
      }
      if ("bc" in settings) {
        $("bc").value = settings.bc;
        $("out").style.backgroundColor = settings.bc;
      }
      if ("tc" in settings) {
        $("tc").value = settings.tc;
        $("out").style.color = settings.tc;
      }
      if ("tsc" in settings) $("tsc").value = settings.tsc;
      if ("ttc" in settings) {
        $("ttc").value = settings.ttc;
        $("t").style.color = settings.ttc;
      }
      if ("repeat" in settings)
        $("repeat").checked = settings.repeat == 1 ? true : false;
      if ("manual" in settings) {
        $("manual").checked = settings.manual == 1 ? true : false;
        manuald();
      }
      if ("position" in settings) {
        setSelectChecked("position", settings.position);
        Tposition(settings.position);
      }
      if ("fs" in settings) {
        setSelectChecked("fontsize", settings.fs);
        $("t").style.fontSize = settings.fs + "px";
      }
    }
  }
  var setting = new Object();
  setting.settime = $("settime").value;
  setting.bc = $("bc").value;
  setting.tc = $("tc").value;
  setting.tsc = $("tsc").value;
  setting.ttc = $("ttc").value;
  setting.repeat = $("repeat").checked ? 1 : 0;
  setting.note = $("note").checked ? 1 : 0;
  setting.manual = $("manual").checked ? 1 : 0;
  setting.position = $("position").value;
  setting.fs = $("fontsize").value;
  localStorage.setItem("suijishu", JSON.stringify(setting));
}

function manuald() {
  var check = $("manual").checked;
  $("timeout").style.display = check ? "none" : "inline-block";
  $("manualtips").style.display = check ? "inline-block" : "none";
  if (!check) {
    m = 0;
    sec = new Date().getTime();
  }
}

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

const slider = document.querySelector(".GETTIME");
slider.labelFormatter = (value) => `${value} ms`;
