import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'
import zhHant from './zh-Hant.json'

const messages = {
  en,
  zh,
  'zh-Hant': zhHant
}

// 从localStorage获取保存的语言设置，默认为简体中文
const savedLocale = localStorage.getItem('rny.locale') || 'zh'

const i18n = createI18n({
  legacy: false, // 使用Composition API
  locale: savedLocale, // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages
})

export default i18n