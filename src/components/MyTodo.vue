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
import { computed, defineComponent, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, reactive } from 'vue'
import { Todo } from '@/types/todo'
import TodoInput from '@/components/TodoInput.vue'
import TodoLabel from '@/components/TodoLabel.vue'
import MyStorage from '@/plugins/Storage'
import { v4 as uuid } from 'uuid'

interface State {
  todoList: Todo[]
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
      console.log('loadData')

      // データの読み込み処理
      state.todoList = [] as Todo[]
      const storage: MyStorage = new MyStorage()
      for (let i = 0; ; i++) {
        const id = storage.getValue('id' + i, '')
        if (id.length === 0) {
          break
        }
        const done = storage.getBool('done' + i, false)
        const date = new Date(storage.getNumber('date' + i, 0))
        const text = storage.getValue('text' + i, '')
        const color = storage.getValue('color' + i, '')
        state.todoList.push({
          id: id,
          done: done,
          date: date,
          text: text,
          color: color
        })
      }
    }
    const saveData = () => {
      console.log('saveData')

      // データの書き込み処理
      const storage: MyStorage = new MyStorage()
      let i = 0
      for (; i < state.todoList.length; i++) {
        const todo = state.todoList[i]
        storage.setValue('id' + i, todo.id)
        storage.setBool('done' + i, todo.done)
        storage.setNumber('date' + i, todo.date.getTime())
        storage.setValue('text' + i, todo.text)
        storage.setValue('color' + i, todo.color)
      }
      storage.setValue('id' + i, '')
    }
    const addTodo = (text: string, color: string) => {
      const id = uuid()
      console.log('uuid ' + id)
      state.todoList = [...state.todoList, {
        id: id,
        done: false,
        date: new Date(),
        text: text,
        color: color
      }]
      saveData()
    }
    const removeTodo = (id: string) => {
      state.todoList = state.todoList.filter((todo: Todo) => todo.id !== id)
      saveData()
    }
    const doneTodo = (id: string) => {
      const todo = state.todoList.find((todo: Todo) => todo.id === id)
      if (todo) {
        todo.done = !todo.done
        saveData()
      }
    }

    // computed
    const sortedTodo = computed(() => {
      // 算出プロパティではデータを直接変更することができないため、sliceで配列をコピー
      const todoList = state.todoList.slice()
      return todoList.sort((a: Todo, b: Todo) => {
        return b.date.getTime() - a.date.getTime()
      })
    })

    onBeforeMount(() => {
      console.log('MyTodo onBeforeMount')
    })
    onMounted(async () => {
      console.log('MyTodo onMounted')

      // データの読み込み
      await loadData()
    })
    onBeforeUpdate(() => {
      console.log('MyTodo onBeforeUpdate')
    })
    onUpdated(() => {
      console.log('MyTodo onUpdated')
    })
    onBeforeUnmount(() => {
      console.log('MyTodo onBeforeUnmount')
    })
    onUnmounted(() => {
      console.log('MyTodo onUnmounted')
    })

    // template内で使用するプロパティ
    return {
      addTodo,
      removeTodo,
      doneTodo,
      sortedTodo
    }
  }
})
</script>
