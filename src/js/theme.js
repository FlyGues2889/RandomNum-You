import { setColorScheme } from "mdui/functions/setColorScheme.js";
import { setTheme as mduiSetTheme } from "mdui/functions/setTheme.js";

const THEME_KEY = "rny.theme.mode";
const COLOR_KEY = "rny.theme.color";
const CUSTOM_KEY = "rny.theme.customLight";
const DEFAULT_COLOR = "#6750a4";

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

  // apply
  mduiSetTheme(mode);
  setColorScheme(color);
  if (custom) setColorScheme(custom);

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

export default {
  init,
  setMode,
  setColor,
  setCustomLight,
  getMode,
  getColor,
  getCustom,
};
