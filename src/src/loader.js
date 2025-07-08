const pageData = [
    {
        name: 'main',
        url: './pages/main.html',
        icon: 'numbers',
        type: 'normal',
    },
    {
        name: 'history',
        url: './pages/history.html',
        icon: 'history',
        type: 'normal',
    },
    {
        name: 'settings',
        url: './pages/setting.html',
        icon: 'settings',
        type: 'settings'
    }
];

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

// 根据 icon 属性生成对应的图标 DOM 元素
function createIconElement(icon) {
    const iconElement = document.createElement('span');
    iconElement.classList.add('material-icons-round');
    iconElement.textContent = icon;
    return iconElement;
}

pageData.forEach(page => {
    eval(`${page.name}Html = getHtmlSync("${page.url}")`);
    // 生成图标元素
    page.iconElement = createIconElement(page.icon);
});

function pageLoad() {
    const layout = document.getElementById('layout');
    pageData.forEach(page => {
        // 创建页面内容
        const pageDiv = document.createElement('div');
        pageDiv.classList.add('page');
        pageDiv.id = `${page.name}Page`;
        pageDiv.setAttribute('x-data', `{ content: ${page.name}Html }`);
        pageDiv.setAttribute('x-effect', '$el.innerHTML = content');

        // 将图标元素插入到导航栏项中
        const navRailItem = document.querySelector(`mdui-navigation-rail-item[value="${page.name}"]`);
        if (navRailItem) {
            navRailItem.insertBefore(page.iconElement, navRailItem.firstChild);
        }

        layout.insertAdjacentElement('beforeend', pageDiv);
    });
}