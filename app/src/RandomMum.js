var c = 0, t, add = [], sec, f = 0, m = 0;

function $(id) {
    return document.getElementById(id)
}

function timedCount(numarr) {
    var node = $('out'), rn = Math.floor(Math.random() * (numarr.length));
    node.style.color = $('tc').value;
    node.innerHTML = numarr[rn];
    c = c + 1;
    if (new Date().getTime() - sec > $('settime').value || m) {
        stopCount();
        c = 0;
        m = 0;
        node.style.color = $('tsc').value;
        add.push(numarr[rn]);
        document.querySelector('#notes span').innerHTML = add.join(', ');
        document.querySelector('#notes b').innerHTML = add.length;
    } else
        t = setTimeout("timedCount(numarr)", 50)
}

function stopCount() {
    clearTimeout(t)
}

function getNum() {
    var manual = $('manual').checked;
    if (c) {
        if (manual) m = 1; function stopCount() {
            clearTimeout(t);
        }

        function getNum() {
            var manual = $('manual').checked;
            if (c) {
                if (manual) m = 1;
                return;
            }
            m = 0;
            var nr = $('num').value, out = $('out');

            // 检查输入是否已更改
            if (sessionStorage.getItem('randomIn') !== nr) {
                sessionStorage.setItem('randomIn', nr);
                add = [];
            }

            const errorSnackbar = document.querySelector(".errorSnackbar");

            // 验证输入格式
            if (!/^\d{1,6}-\d{1,6}$/.test(nr)) {
                errorSnackbar.open = true;
                return;
            }

            let arr = nr.split("-").map(Number);
            let in0 = Math.min(arr[0], arr[1]);
            let in1 = Math.max(arr[0], arr[1]);

            // 使用条件表达式简化输出
            out.innerHTML = (in0 === in1) ? in0 : '';

            // 创建数字数组
            let numarr = [];
            for (let i = in0; i <= in1; i++) {
                if (!$('repeat').checked || !add.includes(i)) {
                    numarr.push(i);
                }
            }

            // 处理无数字情况
            if (numarr.length === 0) {
                add = [];
                window.removeEventListener("devicemotion", motionEventHandler, false);
                out.style.color = 'rgb(var(--mdui-color-primary))';
                out.innerHTML = 'Done';
                return;
            }

            sec = new Date().getTime();
            if (manual) sec += 1000 * 60 * 60 * 24 * 7; // 添加一周的毫秒数
            timedCount(numarr);
        }

        return;
    }
    m = 0;
    var nr = $('num').value, out = $('out');
    if (sessionStorage.getItem('randomIn') != nr) {
        sessionStorage.setItem('randomIn', nr);
        add = [];
    }
    const errorSnackbar = document.querySelector(".errorSnackbar");
    if (!/^\d{1,6}-\d{1,6}$/.test(nr)) return errorSnackbar.open = true;
    arr = nr.split("-");
    a = 0, b = 0;
    var in0 = Number(arr[0]), in1 = Number(arr[1]);
    if (in0 > in1) {
        a = in0;
        b = in1;
    } else if (in1 > in0) {
        a = in1;
        b = in0;
    } else {
        out.innerHTML = in0;
        return
    }
    numarr = [];
    var i = b;
    while (i <= a) {
        if (!$('repeat').checked || add.indexOf(i) == -1)
            numarr.push(i);
        i++;
    }
    if (numarr.length == 0) {
        add = [];
        window.removeEventListener("devicemotion", motionEventHandler, false);
        x = y = z = lastX = lastY = lastZ = 0;
        out.style.color = 'rgb(var(--mdui-color-primary))';
        out.innerHTML = 'Done';
        return;
    }
    sec = new Date().getTime();
    if (manual) sec += 1000 * 60 * 60 * 24 * 7;
    timedCount(numarr)
}

document.onkeydown = function (e) {
    var keyCode = window.event ? e.keyCode : e.which;
    if ((13 == keyCode || 32 == keyCode) && f == 0) {
        getNum();
        $('num').blur();
        return false;
    }
}
window.onresize = function () {
    var isFull = !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    var the = $('out').style;
    var T = $('t').style;
    if (isFull == false) {
        the.position = '';
        the.width = '';
        the.height = '';
        the.fontSize = '100px';
        the.lineHeight = '';
        T.display = 'none';
        document.body.parentNode.style.overflow = 'auto';
        window.removeEventListener("devicemotion", motionEventHandler, false);
    } else {
        the.position = 'fixed';
        the.width = '100%';
        the.height = '100%';
        the.fontSize = '28vw';
        the.lineHeight = '100vh';
        the.top = 0;
        the.left = 0;
        the.zIndex = 9;
        T.color = $('ttc').value;
        if ($('boxbtn').checked) T.display = 'block';
        T.zIndex = 10;
        document.body.parentNode.style.overflow = 'hidden';
    }
}
var speed = 30, last_update = 0, x = y = z = lastX = lastY = lastZ = 0, zd = sy = 0;

function motionEventHandler(e) {
    var acceleration = e.accelerationIncludingGravity;
    x = acceleration.x;
    y = acceleration.y;
    z = acceleration.z;
    if (Math.abs(x - lastX) > speed || Math.abs(y - lastY) > speed || Math.abs(z - lastZ) > speed) {
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
        $('time').innerHTML = (vx * 0.001).toFixed(2);
        if (vx < vs) settime(vs, vx)
    }, 50);
}

function storage(n) {
    if (n) {
        if (localStorage.getItem("suijishu")) {
            var settings = JSON.parse(localStorage.getItem("suijishu"));
            if ('settime' in settings) {
                $('settime').value = settings.settime;
                settime(settings.settime, 0)
            }
            if ('bc' in settings) {
                $('bc').value = settings.bc;
                $('out').style.backgroundColor = settings.bc
            }
            if ('tc' in settings) {
                $('tc').value = settings.tc;
                $('out').style.color = settings.tc
            }
            if ('tsc' in settings) $('tsc').value = settings.tsc;
            if ('ttc' in settings) {
                $('ttc').value = settings.ttc;
                $('t').style.color = settings.ttc
            }
            if ('repeat' in settings) $('repeat').checked = (settings.repeat == 1 ? true : false);
            if ('note' in settings) {
                if (settings.note == 1) {
                    $('note').checked = true;
                    $('notes').style.display = 'block'
                } else $('note').checked = false
            }
            if ('manual' in settings) {
                $('manual').checked = (settings.manual == 1 ? true : false);
                manuald()
            }
            if ('position' in settings) {
                setSelectChecked('position', settings.position);
                Tposition(settings.position)
            }
            if ('fs' in settings) {
                setSelectChecked('fontsize', settings.fs);
                $('t').style.fontSize = settings.fs + 'px'
            }
        }
    }
    var setting = new Object();
    setting.settime = $('settime').value;
    setting.bc = $('bc').value;
    setting.tc = $('tc').value;
    setting.tsc = $('tsc').value;
    setting.ttc = $('ttc').value;
    setting.repeat = $('repeat').checked ? 1 : 0;
    setting.note = $('note').checked ? 1 : 0;
    setting.manual = $('manual').checked ? 1 : 0;
    setting.position = $('position').value;
    setting.fs = $('fontsize').value;
    localStorage.setItem("suijishu", JSON.stringify(setting));
}

function manuald() {
    var check = $('manual').checked;
    $('timeout').style.display = check ? 'none' : 'inline-block';
    $('manualtips').style.display = check ? 'inline-block' : 'none';
    if (!check) {
        m = 0;
        sec = new Date().getTime()
    }
    ;
}

function setSelectChecked(id, val) {
    var node = $(id), i = 0;
    for (; i < node.options.length; i++) {
        if (node.options[i].value == val) {
            node.options[i].selected = true;
            break;
        }
    }
}

const slider = document.querySelector(".GETTIME");
slider.labelFormatter = (value) => `${value} ms`;

