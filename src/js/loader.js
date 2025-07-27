function navigate(pageId) {
  var pages = document.querySelectorAll(".page");
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove("active");
    pages[i].style.display = "none"; // 隐藏所有页面
  }

  var currentPage = document.getElementById(pageId);
  currentPage.style.display = "block"; // 先显示页面

  void currentPage.offsetWidth;

  currentPage.classList.add("active");

  var navigationItems = document.querySelectorAll("mdui-navigation-rail-item");
  for (var i = 0; i < navigationItems.length; i++) {
    navigationItems[i].removeAttribute("active");
  }
  const toSettings = document.getElementById("toSettings");
  toSettings.selected = false; // 取消选中状态

  if (pageId === "settingsPage") {
    setTimeout(() => {
      toSettings.selected = true; // 设置选中状态
    }, 1);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  // 设置默认页面
  navigate("mainPage");
});

const pageData = [
  {
    name: "main",
    url: "./pages/main.html",
    icon: "numbers",
    type: "normal",
    // text: '抽取'
  },
  {
    name: "history",
    url: "./pages/history.html",
    icon: "history",
    type: "normal",
    // text: '历史'
  },
  {
    name: "settings",
    url: "./pages/setting.html",
    icon: "settings",
    type: "settings",
  },
];

function getHtmlSync(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false); //  Sync : false
  xhr.send(null);
  if (xhr.status === 200) {
    return xhr.responseText;
  } else {
    console.error("Request failed:", url, xhr.status);
    return null;
  }
}

function createIconElement(icon) {
  const iconElement = document.createElement("span");
  iconElement.classList.add("material-icons-outlined");
  iconElement.textContent = icon;
  return iconElement;
}

pageData.forEach((page) => {
  eval(`${page.name}Html = getHtmlSync("${page.url}")`);
  page.iconElement = createIconElement(page.icon);
});

function pageLoad() {
  const layout = document.getElementById("layout");
  pageData.forEach((page) => {
    const pageDiv = document.createElement("div");
    pageDiv.classList.add("page");
    pageDiv.id = `${page.name}Page`;
    pageDiv.setAttribute("x-data", `{ content: ${page.name}Html }`);
    pageDiv.setAttribute("x-effect", "$el.innerHTML = content");

    const navRailItem = document.querySelector(
      `mdui-navigation-rail-item[value="${page.name}"]`
    );
    if (navRailItem) {
      navRailItem.insertBefore(page.iconElement, navRailItem.firstChild);
    }

    layout.insertAdjacentElement("beforeend", pageDiv);
  });
}
