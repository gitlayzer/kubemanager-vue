import { createApp } from 'vue'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入图标视图
import * as ELIcons from '@element-plus/icons-vue'
//引入App.vue主组件
import App from './App.vue'
//引入路由配置及规则
import router from './router'
//codemirror编辑器
import { GlobalCmComponent } from "codemirror-editor-vue3";
// 引入主题 可以从 codemirror/theme/ 下引入多个
import 'codemirror/theme/idea.css'
// 引入语言模式 可以从 codemirror/mode/ 下引入多个
import 'codemirror/mode/yaml/yaml.js'

//创建vue实例
const app = createApp(App)
//将图标注册为全局组件
for (let iconName in ELIcons) {
	app.component(iconName, ELIcons[iconName])
}
//引入element plus
app.use(ElementPlus)
//引入codemirror编辑器
app.use(GlobalCmComponent, { componentName: "codemirror" });
//引入路由
app.use(router)
app.mount('#app')