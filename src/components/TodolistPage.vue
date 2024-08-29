<script setup>
import { ref, onMounted } from 'vue';
import TodoItem from './TodoItem.vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';


const API_URL = import.meta.env.VITE_API_URL;
const token = ref('');
const chooseTab = ref('全部');

const user = ref({
  uid: '',
  nickname: ''
});

const router = useRouter();

//Loading
const isLoading = ref(false);

//切換狀態頁籤
const changeTab = (text) => {
  chooseTab.value = text;

  switch(chooseTab.value) {
    case "全部":
      todoList.value = todoData.value;
      break;
    case "待完成":
      todoList.value = todoData.value.filter((item) => !item.status);
      break;
    case "已完成":
      todoList.value = todoData.value.filter((item) => item.status);
      break;
    default:

  }
}

//登出
const signOut = async () => {
  try {
    isLoading.value = true;
    const res = await axios.post(`${API_URL}/users/sign_out`, {}, {
      headers:{
        Authorization: token.value
      }
    });
    
    setTimeout(() => {
      alert('登出成功!');
      token.value = '';
      router.push('/');
      isLoading.value = false;
    }, 1000);
    

  } catch (error) {
    const arr = error.message.split(' ');
    const status = arr[arr.length - 1];

    if (status == 400) {
      alert('登出失敗!');
    }
    else {
      alert('登出發生錯誤:' + error.message);
    }
    isLoading.value = false;
  }
}

const todoList = ref([]); //顯示在畫面上的Todo
const todoData = ref([]); //全部Todo資料
const inputTodo = ref('');


//取得TodoList
const getTodoList = async () => {
  try {
    const res = await axios.get(`${API_URL}/todos`, {
      headers:{
        Authorization: token.value
      }
    });

    todoList.value = res.data.data;
    todoData.value = res.data.data;
    chooseTab.value = '全部';
    
  } catch (error) {
    alert('取得TodoList失敗:' + error.message);
  }
}

//新增Todo
const addTodo = async () => {
  try {
    if (inputTodo.value.trimEnd() == '') {
      alert('新增的待辦事項不能空白，請重新輸入');
      inputTodo.value = '';
      return;
    }
    if (todoData.value.find((item) => item.content == inputTodo.value.trimEnd())) {
      alert('新增的待辦事項已存在! 請重新輸入');
      inputTodo.value = '';
      return;
    }

    isLoading.value = true;
    const res = await axios.post(`${API_URL}/todos`,
      {
        content: inputTodo.value
      },
      {
        headers: {
            Authorization: token.value
          }
    });

    if (res.status == 201) {
      alert('新增Todo成功!');
      inputTodo.value = '';
      getTodoList();
      isLoading.value = false;
    }
    

  } catch (error) {
    alert('新增Todo失敗:' + error.message);
    isLoading.value = false;
  }
}

//刪除Todo
const delTodo = async (id) => {
  try {
    isLoading.value = true;
    const res = await axios.delete(`${API_URL}/todos/${id}`, {
      headers: {
        Authorization: token.value
      }
    });

    if (res.status == 200) {
      alert('刪除Todo完成!');
      getTodoList();
      isLoading.value = false;
    }
    

  } catch (error) {
    alert('刪除Todo失敗:' + error.message);
    isLoading.value = false;
  }
}

//切換待辦事項狀態
const toggleStatus = async (todo) => {
  try {
    await axios.patch(`${API_URL}/todos/${todo.id}/toggle`, {},{
      headers: {
        Authorization: token.value
      }
    });
    getTodoList();

  } catch (error) {
    alert('更改狀態失敗: ' + error.message);
  }
}

//清除所有已完成待辦事項
const clearAllComplete = async () => {
  try {
    isLoading.value = true;
    const doneTodos = todoData.value.filter((item) => item.status && 
      axios.delete(`${API_URL}/todos/${item.id}`, {
        headers: {
          Authorization: token.value
        }
    }));

    if (doneTodos.length == 0) {
      alert('當前沒有已完成項目!');
      isLoading.value = false;
      return;
    }

    await Promise.all(doneTodos);
    
    setTimeout(() => {
      alert('清除已完成事項成功!');
      getTodoList();
      isLoading.value = false;
    }, 1000);

  } catch (error) {
    alert('清除已完成事項失敗: ' + error.message);
    isLoading.value = false;
  }
}



//驗證登入
onMounted(async () => {
    token.value = document.cookie.replace(
        /(?:(?:^|.*;\s*)customTodoToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
    );

    if (!token.value) {
      setTimeout(() => {
        alert('無 token，頁面將轉至登入頁');
        router.push('/');
      }, 500);
    }

    try {
      isLoading.value = true;
      const res = await axios.get(`${API_URL}/users/checkout`, {
          headers: {
              Authorization: token.value
          }  
      });

      user.value = res.data;
      getTodoList();
      isLoading.value = false;

    } catch (error) {
        alert(error.message);
        setTimeout(() => {
            alert('驗證失效');
            router.push('/');
            isLoading.value = false;
        }, 1000);
    }
    
})

</script>

<template>
  <!-- Loading 執行畫面 -->
  <loading v-model:active="isLoading" />
  <!-- ToDo List -->
  <div id="todoListPage" class="bg-half">
    <nav>
      <h1><RouterLink to="#">ONLINE TODO LIST</RouterLink></h1>
      <ul>
        <li class="todo_sm"><RouterLink to="/todolist" class="formControls_btnLink"><span>{{ user.nickname }}的代辦</span></RouterLink></li>&nbsp;&nbsp;
        <li><RouterLink to="" class="formControls_btnLink" @click.prevent="signOut">登出</RouterLink></li>
      </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="inputTodo" />
          <RouterLink to="#" class="formControls_btnLink" @click="addTodo">
            <FontAwesomeIcon icon="fa-solid fa-plus" />
          </RouterLink>
        </div>
        <div class="todoList_list" v-if="todoData.length > 0">
          <ul class="todoList_tab">
            <li class="changeBackgroundColor"><RouterLink to="#" :class="[chooseTab == '全部' ? 'active' : '']" @click="changeTab('全部')">全部</RouterLink></li>
            <li class="changeBackgroundColor"><RouterLink to="#" :class="[chooseTab == '待完成'? 'active' : '']" @click="changeTab('待完成')">待完成</RouterLink></li>
            <li class="changeBackgroundColor"><RouterLink to="#" :class="[chooseTab == '已完成'? 'active' : '']" @click="changeTab('已完成')">已完成</RouterLink></li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item">
              <TodoItem :todo-list="todoList" @del-todo="delTodo" @toggle-status="toggleStatus" />
            </ul>
            <div className="todoList_statistics">
                <p> {{ todoData.filter((item) => !item.status).length }} 個待完成項目</p>
                <RouterLink to="#" className="formControls_btnLink" @click.prevent="clearAllComplete"><p style="color: red;">清除已完成項目</p></RouterLink>
            </div>
          </div>
        </div>
        <div className="empty" v-else>
          <p align="center">目前尚無待辦事項</p>
          <img src='https://github.com/spikesandmaen484/vue-todolist-api/blob/main/src/img/person.png?raw=true' alt='目前尚無待辦事項' />
          <!-- <img src='../img/person.png?raw=true' alt='目前尚無待辦事項' /> -->
        </div>
        
      </div>
    </div>
  </div>
</template>
