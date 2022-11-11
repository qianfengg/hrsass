import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的插件包
import Cookies from 'js-cookie' // 引入cookie包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
Vue.use(VueI18n) // 全局注册国际化包

// 创建国际化插件的实例
export default new VueI18n({
  // 指定语言类型
  locale: Cookies.get('language') || 'zh', // 从cookie中获取语言类型 获取不到就是中文
  messages: {
    en: {
      ...elementEN // 将饿了么的英文语言包引入
    },
    zh: {
      ...elementZH // 将饿了么的中文语言包引入
    }
  }
})
