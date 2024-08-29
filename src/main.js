import './css/all.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
/* add fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* add some free styles */
import { faUserSecret, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

library.add(faUserSecret, faPlus, faTrash)

const app = createApp(App)

app.use(router)

app.mount('#app')
