<script setup>
import { defineProps, defineEmits } from 'vue';
import { RouterLink } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps(['todo-list']);
const emit = defineEmits(['del-todo', 'toggle-status']);

</script>
<template>
    <li v-for="todo in props.todoList" :key="todo.id">
        <label class="todoList_label changeBackgroundColor">
            <input class="todoList_input" type="checkbox" :value="todo.status" :checked="todo.status"  @change.prevent="emit('toggle-status', todo)"/>
            <span>{{ todo.content }}</span>
        </label>
        <RouterLink to="#" @click.prevent="emit('del-todo', todo.id)">
            <FontAwesomeIcon icon="fa-solid fa-trash" />
        </RouterLink>
    </li>
</template>