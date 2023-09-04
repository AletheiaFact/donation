import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css'

import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports'
Amplify.configure(awsExports);

const app = createApp(App);
app.use(Antd).mount('#app')
