//https://v2.tauri.org.cn/reference/javascript/api/namespacewindow/
const tauriWindow = window.__TAURI__.window;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('titlebar-minimize')?.addEventListener('click', () => tauriWindow.getCurrentWindow().minimize()); //最小化窗口
    document.getElementById('titlebar-maximize')?.addEventListener('click', () => tauriWindow.getCurrentWindow().toggleMaximize()); //切换切换窗口最大化状态
    document.getElementById('titlebar-close')?.addEventListener('click', () => tauriWindow.getCurrentWindow().close()); //关闭窗口
});