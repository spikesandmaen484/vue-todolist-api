<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const API_URL = import.meta.env.VITE_API_URL;

const router = useRouter();

//Loading
const isLoading = ref(false);

const user = ref({
  email: '',
  password: ''
});

const errors = ref({
  email: '',
  password: ''
});

//驗證
const okEmail = ref(false);
const okPassword = ref(false);


//登入
const signIn = async () => {
  try {
    
    if (!user.value.email && !user.value.password) {
      alert('請輸入登入資料');
      return;
    }

    if (!okEmail.value || !okPassword.value) {
      return;
    }
    
    isLoading.value = true;
    const res = await axios.post(`${API_URL}/users/sign_in`, {
      email: user.value.email,
      password: user.value.password
    });

    document.cookie = `customTodoToken=${res.data.token};`;
    
    if (res.status == 200) { //登入成功
      setTimeout(() => {
        alert('登入成功!');
        
        //轉址到TodoList頁面
        router.push('/todolist');
        isLoading.value = false;
      }, 1000);
      
    }
    


  } catch (error) {
    const arr = error.message.split(' ');
    const status = arr[arr.length - 1];

    if (status == 400) { //欄位驗證失敗
      alert('欄位驗證失敗!');
    }
    else if (status == 401) { //帳號密碼驗證錯誤
      alert('帳號密碼驗證錯誤!');
    }
    else if (status == 404) {  //用戶不存在
      alert('用戶不存在!');
    }
    else {
      alert('登入失敗:' + error.message);
    }
    isLoading.value = false;
  }
}

watch(user, (newVal) => {
  //信箱
  if(newVal.email.trim() == '') {
    errors.value.email = '此欄位不可留空';
    okEmail.value = false;
  }
  else if (!newVal.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    errors.value.email = '信箱格式錯誤';
    okEmail.value = false;
  }
  else {
    errors.value.email = '';
    okEmail.value = true;
  }

  //密碼
  if(newVal.password.trim() == '') {
    errors.value.password = '此欄位不可留空';
    okPassword.value = false;
  }
  else if (newVal.password.trim().length < 6) {
    errors.value.password = '密碼長度最少6碼';
    okPassword.value = false;
  }
  else if (newVal.password.trim().length > 20) {
    errors.value.password = '密碼長度最長20碼';
    okPassword.value = false;
  }
  else {
    errors.value.password = '';
    okPassword.value = true;
  }

}, { deep: true });


</script>

<template>
  <!-- Loading 執行畫面 -->
  <loading v-model:active="isLoading" />
  <!-- login_page -->
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer ">
      <div class="side">
        <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
        <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
      </div>
      <div>
        <form class="formControls" action="">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" v-model="user.email" />
          <span v-if="errors.email">{{ errors.email }}</span>
          <label class="formControls_label" for="password">密碼</label>
          <input class="formControls_input" type="password" name="password" id="password" placeholder="請輸入密碼" v-model="user.password" />
          <span v-if="errors.password">{{ errors.password }}</span>
          <button class="formControls_btnSubmit" type="submit" @click.prevent="signIn">登入</button>
          <RouterLink to="/signUp" class="formControls_btnLink">註冊帳號</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>
