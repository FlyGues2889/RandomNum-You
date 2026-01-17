import { setColorScheme } from "mdui/functions/setColorScheme.js";
import { setTheme as mduiSetTheme } from "mdui/functions/setTheme.js";
import {
  applyBackgroundImage,
  saveBackgroundImage,
  clearBackgroundImage,
} from "./background.js";

const THEME_KEY = "rny.theme.mode";
const COLOR_KEY = "rny.theme.color";
const CUSTOM_KEY = "rny.theme.customLight";
const BACKGROUND_IMAGE_SWITCH_KEY = "backgroundImageSwitch";
const BACKGROUND_POSITION_KEY = "backgroundImagePosition";
const DEFAULT_COLOR = "#6750a4";
const DEFAULT_BACKGROUND_POSITION = "page";

function getStored(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}
function setStored(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    /* ignore */
  }
}

function init() {
  const mode = getStored(THEME_KEY) || "auto";
  const color = getStored(COLOR_KEY) || DEFAULT_COLOR;
  const custom = getStored(CUSTOM_KEY) || null;

  // apply theme
  mduiSetTheme(mode);
  setColorScheme(color);
  if (custom) setColorScheme(custom);

  // apply background image
  applyBackgroundImage();

  return { mode, color, custom };
}

function setMode(mode) {
  mduiSetTheme(mode);
  setStored(THEME_KEY, mode);
}

function setColor(color) {
  setColorScheme(color);
  setStored(COLOR_KEY, color);
}

function setCustomLight(color) {
  setStored(CUSTOM_KEY, color);
  // apply custom as current color as well
  setColorScheme(color);
  setStored(COLOR_KEY, color);
}

function getMode() {
  return getStored(THEME_KEY) || "auto";
}
function getColor() {
  return getStored(COLOR_KEY) || DEFAULT_COLOR;
}
function getCustom() {
  return getStored(CUSTOM_KEY) || null;
}

/**
 * 选择背景图片
 */
async function backgroundImageChoose() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          await saveBackgroundImage(file);
          localStorage.setItem(BACKGROUND_IMAGE_SWITCH_KEY, "true");
          await applyBackgroundImage();
          resolve(true);
        } catch (error) {
          console.error("Failed to save background image:", error);
          resolve(false);
        }
      } else {
        resolve(false);
      }
    };

    input.click();
  });
}

/**
 * 切换背景图片开关
 */
function backgroundImageSwitchChange() {
  const switchElement = document.getElementById("backgroundImage");
  if (!switchElement) return;

  const isChecked = switchElement.checked;
  localStorage.setItem(BACKGROUND_IMAGE_SWITCH_KEY, isChecked.toString());

  if (isChecked) {
    applyBackgroundImage();
  } else {
    clearBackgroundImage();
  }
}

/**
 * 获取背景位置
 */
function getBackgroundPosition() {
  return getStored(BACKGROUND_POSITION_KEY) || DEFAULT_BACKGROUND_POSITION;
}

/**
 * 设置背景位置
 */
function setBackgroundPosition(position) {
  setStored(BACKGROUND_POSITION_KEY, position);
  applyBackgroundImage();
}

/**
 * 透明度变化处理
 */
export default {
  init,
  setMode,
  setColor,
  setCustomLight,
  getMode,
  getColor,
  getCustom,
  backgroundImageChoose,
  backgroundImageSwitchChange,
  getBackgroundPosition,
  setBackgroundPosition,
};
