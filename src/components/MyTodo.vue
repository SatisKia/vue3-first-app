<template>
  <div>
    <todo-input
      v-on:add="addTodo"
    />
    <todo-label
      v-for="todo in sortedTodo"
      v-bind:key="todo.id"
      v-bind:todo="todo"
      v-on:done="doneTodo"
      v-on:remove="removeTodo"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive } from 'vue'
import { Todo } from '@/types/todo'
import TodoInput from '@/components/TodoInput.vue'
import TodoLabel from '@/components/TodoLabel.vue'

interface State {
  todoList: Todo[];
}

export default defineComponent({
  components: {
    TodoInput,
    TodoLabel
  },
  setup () {
    // data
    const state = reactive<State>({
      todoList: [] as Todo[]
    })

    // methods
    const loadData = async () => {
      // データの読み込み処理
      state.todoList = [] as Todo[]
      console.log('loadData')
    }
    const saveData = () => {
      // データの書き込み処理
      console.log('saveData')
    }
    const addTodo = (text: string, color: string) => {
      state.todoList = [...state.todoList, {
        id: (new Date()).getTime().toString(),
        done: false,
        date: new Date(),
        text: text,
        color: color
      }]
      saveData()
    }
    const removeTodo = (id: string) => {
      state.todoList = state.todoList.filter(todo => todo.id !== id)
      saveData()
    }
    const doneTodo = (id: string) => {
      const todo = state.todoList.find(todo => todo.id === id)
      if (todo) {
        todo.done = !todo.done
        saveData()
      }
    }

    // computed
    const sortedTodo = computed(() => {
      return state.todoList.slice().sort((a, b) => {
        return b.date.getTime() - a.date.getTime()
      })
    })

    // mounted
    onMounted(async () => {
      // データの読み込み
      await loadData()
    })

    return {
      addTodo,
      removeTodo,
      doneTodo,
      sortedTodo
    }
  }
})
</script>
