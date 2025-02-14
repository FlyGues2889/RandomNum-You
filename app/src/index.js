//定义一个变量进行判断，默认false 非全屏状态
var exitFullscreen = false

// 全屏事件
function handleFullScreen() {
    var element = document.documentElement;
    var btnIcon = document.getElementById('btn-fullscreen-icon'); // 获取按钮的引用

    if (document.fullscreenElement) {
        // 当前已全屏，退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        btnIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg>'; // 更改图标为 SVG
    } else {
        // 当前未全屏，请求全屏
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
        }
        btnIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg>'; // 更改图标为 SVG
    }
}

window.onresize = function () {
    var isFull = !!document.fullscreenElement; // 使用现代API来检测全屏状态
    if (isFull == false) {
        $("#exitFullScreen").css("display", "none");
        $("#fullScreen").css("display", "");
    } else {
        $("#exitFullScreen").css("display", "");
        $("#fullScreen").css("display", "none");
    }
}


function openDialog1() {
    const dialog1 = document.querySelector(".example-action");
    const closeButton1 = dialog1.querySelector("mdui-button");

    dialog1.open = true;
    closeButton1.addEventListener("click", () => dialog1.open = false);

}


function openErrorDialog() {
    const errorSnackbar = document.querySelector(".errorSnackbar");

    errorSnackbar.open = true;
}

function openBlockDialog() {
    const blockDialog = document.querySelector(".block-dialog");
    const closeButton2 = blockDialog.querySelector("mdui-button");

    blockDialog.open = true;
    closeButton2.addEventListener("click", () => blockDialog.open = false);
}

function copyToClipboard1() {
    const outContent = document.getElementById('out').innerText; // 获取 div#out 的内容

    navigator.clipboard.writeText(outContent).then(() => {
        // 复制成功的反馈
        const copySuccessSnackbar = document.querySelector(".copySuccessSnackbar");

        // 如果当前 SnackBar 正在显示，先关闭它
        if (copySuccessSnackbar.open) {
            copySuccessSnackbar.open = false;
        }

        // 显示新的 SnackBar
        copySuccessSnackbar.open = true;
    }).catch(err => {
        // 复制失败的反馈
        const copyErrorSnackbar = document.querySelector(".copyErrorSnackbar");

        // 如果当前 SnackBar 正在显示，先关闭它
        if (copyErrorSnackbar.open) {
            copyErrorSnackbar.open = false;
        }

        // 显示新的 SnackBar
        copyErrorSnackbar.open = true;
        console.error('复制失败:', err);
    });
}

function copyToClipboard2() {
    // 获取 div#notes 的内容
    const notesContent = document.getElementById('notes').innerText;

    navigator.clipboard.writeText(notesContent).then(() => {
        // 复制成功的反馈
        const copySuccessSnackbar = document.querySelector(".copySuccessSnackbar");

        // 如果当前 SnackBar 正在显示，先关闭它
        if (copySuccessSnackbar.open) {
            copySuccessSnackbar.open = false;
        }

        // 显示新的 SnackBar
        copySuccessSnackbar.open = true;
    }).catch(err => {
        // 复制失败的反馈
        const copyErrorSnackbar = document.querySelector(".copyErrorSnackbar");

        // 如果当前 SnackBar 正在显示，先关闭它
        if (copyErrorSnackbar.open) {
            copyErrorSnackbar.open = false;
        }

        // 显示新的 SnackBar
        copyErrorSnackbar.open = true;
        console.error('复制失败:', err);
    });
}

// 显示设置已保存反馈
function showSettingsSavedSnackbar() {
    const settingSnackbar = document.querySelector(".settingsSnackbar");

    // 如果当前 SnackBar 正在显示，先关闭它
    if (settingSnackbar.open) {
        settingSnackbar.open = false;
    }

    // 显示新的 SnackBar
    settingSnackbar.open = true;
}
