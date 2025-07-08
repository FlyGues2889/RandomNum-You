function alert(message) {
  mdui.alert({
    headline: "提示",
    description: message,
    confirmText: "OK",
    onConfirm: () => console.log("confirmed"),
  });
}

function notice(message) {
  mdui.snackbar({
    message: message,
  });
}

class ThemeManager {
  // 从本地存储读取主题和配色
  getTheme() {
    return {
      theme: localStorage.getItem("theme") || "light",
      light: localStorage.getItem("light") || "defaultTheme",
      usingCustomLight: localStorage.getItem("usingCustomLight") || "false",
      customLight: localStorage.getItem("customLight") || "",
      backgroundImageSwitch:
        localStorage.getItem("backgroundImageSwitch") || "false",
    };
  }

  // 设置主题，并保存到本地存储
  setTheme(theme) {
    document.querySelector("#body").className = `mdui-theme-${theme}`;
    localStorage.setItem("theme", theme);
  }

  // 设置配色方案，并保存到本地存储
  setLight(themeLight) {
    document.querySelector("html").className = themeLight;
    localStorage.setItem("light", themeLight);
    localStorage.setItem("usingCustomLight", "false");
  }

  setCustomLight(color, load = true) {
    localStorage.setItem("customLight", color);
    if (load) {
      localStorage.setItem("usingCustomLight", "true");
      document.querySelector("html").className = "";
      mdui.setColorScheme(color);
    }
  }

  // 初始化主题和配色（页面加载时调用）
  initTheme() {
    const { theme, light, backgroundImageSwitch } = this.getTheme();
    this.setTheme(theme);
    if (localStorage.getItem("usingCustomLight") === "true") {
      this.setCustomLight(localStorage.getItem("customLight"));
    } else {
      this.setLight(light);
    }
    const themeToggle = document.querySelector("#theme-toggle");
    if (themeToggle) {
      themeToggle.value = theme;
    }

    // 等待dom加载完成
    document.addEventListener("DOMContentLoaded", async () => {
      if (backgroundImageSwitch == "true") {
        await loadBackgroundImage();
      }
    });
  }

  backgroundImageChoose() {
    // 创建文件选择框
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      // 保持 onchange 为 async 函数
      const file = e.target.files[0];
      if (!file) return;

      //这里，存储图片
      try {
        await saveFile(file); // 调用独立出来的 saveFile 函数
        //await loadBackgroundImage(); // 加载背景图片
        //localStorage.setItem('backgroundImageSwitch', "true"); // 设置开关
      } catch (error) {
        console.error("保存图片到 IndexedDB 失败:", error);
        alert("图片保存失败，请稍后重试。");
        return; // 如果保存失败，则停止后续操作
      }

      // 提取 FileReader 和图片处理逻辑
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          if (
            typeof mdui !== "undefined" &&
            typeof mdui.getColorFromImage === "function"
          ) {
            mdui
              .getColorFromImage(img)
              .then((color) => {
                console.log(color);
                //notice('Set the custom light color according to the image:' + color);
                this.setCustomLight(color, false);
              })
              .catch((err) => {
                alert("无法提取图片主色：" + err);
              });
          } else {
            console.warn("mdui 或 getColorFromImage 函数未定义。");
          }
        };
        img.onerror = () => {
          alert("图片加载失败");
        };
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  backgroundImageSwitchChange() {
    const backgroundImageSwitch = document.querySelector("#backgroundImage");
    if (backgroundImageSwitch.checked) {
      try {
        loadBackgroundImage();
        mdui.setColorScheme(localStorage.getItem("customLight"));
        localStorage.setItem("usingCustomLight", "true");
      } catch (error) {
        notice("加载背景图片失败:", error);
        backgroundImageSwitch.checked = false;
      }
    } else {
      // 获取 body 标签，替换原本的 document.documentElement
      const mainPage = document.body;
      mainPage.style.backgroundImage = "none";
      mainPage.style.backgroundColor = "rgb(var(--mdui-color-surface)";

      localStorage.setItem("backgroundImageSwitch", "false");
    }
  }
}
function BlurChange() {
  const blurLayer = document.querySelector("#blur-layer");
  const blurSlider = document.querySelector("#blur");
  blurLayer.style.filter = "blur(" + blurSlider.value + "px)";
  blurLayer.style.backdropFilter = "blur(" + blurSlider.value + "px)";
  blurSlider.labelFormatter = (value) => `${value} px`

  localStorage.setItem("blur", blurSlider.value);
}

// 挂载主题相关方法到全局对象
window.theme = new ThemeManager();

window.theme.initTheme();
