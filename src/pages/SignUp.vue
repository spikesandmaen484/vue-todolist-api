<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const API_URL = import.meta.env.VITE_API_URL;

const user = ref({
  email: '',
  password: '',
  confirmPwd: '',
  nickname: ''
});

const router = useRouter();

//Loading
const isLoading = ref(false);

//驗證
const okEmail = ref(false);
const okNickname = ref(false);
const okPassword = ref(false);
const okConfirmPwd = ref(false);


const errors = ref({
  email: '',
  password: '',
  nickname: '',
  confirmPwd: ''
});

//註冊
const signUp = async () => {
  try {
    if (!user.value.email && !user.value.password && !user.value.nickname && !user.value.confirmPwd) {
      alert('請輸入註冊資料');
      return;
    }
    
    if (!okEmail.value || !okNickname.value || !okPassword.value || !okConfirmPwd.value) {
      return;
    }
    
    isLoading.value = true;
    const res = await axios.post(`${API_URL}/users/sign_up`, {
      email: user.value.email,
      password: user.value.password,
      nickname: user.value.nickname
    });
    
    if (res.status == 201) {
      setTimeout(() => {
        alert('註冊完成!');
        router.push('/');
        isLoading.value = false;
      }, 2000);
    }


  } catch (error) {
    const arr = error.message.split(' ');
    const status = arr[arr.length - 1];

    if (status == 400) {
      alert('用戶已存在');
    }
    else {
      alert('註冊失敗:' + error.message);
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

  //暱稱
  if(newVal.nickname.trim() == '') {
    errors.value.nickname = '此欄位不可留空';
    okNickname.value = false;
  }
  else {
    errors.value.nickname = '';
    okNickname.value = true;
  }

  //確認密碼
  if(newVal.confirmPwd.trim() == '') {
    errors.value.confirmPwd = '此欄位不可留空';
    okConfirmPwd.value = false;
  }
  else if (newVal.confirmPwd.trim().length < 6) {
    errors.value.confirmPwd = '密碼長度最少6碼';
    okConfirmPwd.value = false;
  }
  else if (newVal.confirmPwd.trim().length > 20) {
    errors.value.confirmPwd = '密碼長度最長20碼';
    okConfirmPwd.value = false;
  }
  else if (newVal.confirmPwd.trim() !== newVal.password.trim()) {
    errors.value.confirmPwd = '密碼與再次輸入密碼不相同';
    okConfirmPwd.value = false;
  }
  else {
    errors.value.confirmPwd = '';
    okConfirmPwd.value = true;
  }

}, { deep: true });

</script>

<template>
  <!-- Loading 執行畫面 -->
  <loading v-model:active="isLoading" />
  <!-- sign up -->
  <div id="signUpPage" class="bg-yellow">
      <div class="conatiner signUpPage vhContainer">
          <div class="side">
              <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
              <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
          </div>
          <div>
              <form class="formControls">
                  <h2 class="formControls_txt">註冊帳號</h2>
                  <label class="formControls_label" for="email">Email</label>
                  <input class="formControls_input" type="email" id="email" name="email" placeholder="請輸入 email" v-model="user.email" />
                  <span v-if="errors.email">{{ errors.email }}</span>
                  <label class="formControls_label" for="name">您的暱稱</label>
                  <input class="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" v-model="user.nickname" />
                  <span v-if="errors.nickname">{{ errors.nickname }}</span>
                  <label class="formControls_label" for="password">密碼</label>
                  <input class="formControls_input" type="password" id="password" placeholder="請輸入密碼" v-model="user.password" />
                  <span v-if="errors.password">{{ errors.password }}</span>
                  <label class="formControls_label" for="confirmPwd">再次輸入密碼</label>
                  <input class="formControls_input" type="password" id="confirmPwd" placeholder="請再次輸入密碼" v-model="user.confirmPwd" />
                  <span v-if="errors.confirmPwd">{{ errors.confirmPwd }}</span>
                  <button class="formControls_btnSubmit" type="submit" @click.prevent="signUp">註冊帳號</button>
                  <RouterLink to="/" class="formControls_btnLink">登入</RouterLink>
              </form>
          </div>
      </div>
  </div>
</template>