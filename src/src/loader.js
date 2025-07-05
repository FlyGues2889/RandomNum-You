const pageData = [
    {
        name: 'main',
        url: './pages/main.html',
        icon: 'numbers',
        type: 'normal',
        text: '抽取'
    },
    {
        name: 'history',
        url: './pages/history.html',
        icon: 'history',
        type: 'normal',
        text: '历史'
    },
    {
        name: 'settings',
        url: './pages/setting.html',
        icon: 'settings',
        type: 'settings'
    }
]

function getHtmlSync(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); // 第三个参数为 false 表示同步
    xhr.send(null);
    if (xhr.status === 200) {
        return xhr.responseText;
    } else {
        console.error('请求失败:', url, xhr.status);
        return null;
    }
}

pageData.forEach(page => {
    eval(`${page.name}Html = getHtmlSync("${page.url}")`);
    //page.html = getHtmlSync(page.url);
});

function pageLoad() {
    const layout = document.getElementById('layout');
    pageData.forEach(page => {
        code = `<div class="page" id="${page.name + "Page"}" x-data="{ content: ${page.name + "Html"} }" x-effect="$el.innerHTML = content"></div>`
        layout.insertAdjacentHTML('beforeend', code);
    });
}