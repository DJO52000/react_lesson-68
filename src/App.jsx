import { createContext, useEffect, useReducer, useState } from "react"
import "./styles.css"
import { NewTodoForm } from "./NewTodoForm"
import { TodoList } from "./TodoList"
import { TodoFilterForm } from "./TodoFilterForm"

const LOCAL_STORAGE_KEY = "TODOS"
const ACTION = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  TOGGLE: "TOGGLE",
  DELETE: "DELETE",
}

function reducer(todos, {type, payload}) {
  switch(type) {
    case ACTION.ADD:
      return [
          ...todos,
          {
              name: payload.name,
              completed: false,
              id: crypto.randomUUID(),
          },
          ]
    case ACTION.TOGGLE:
      return todos.map((todo) => {
          if (todo.id === payload.id) {
            return { ...todo, completed: payload.completed }
          }
          return todo
      })
    case ACTION.DELETE:
      return todos.filter((todo) => todo.id !== payload.id)
    case ACTION.UPDATE:
      return todos.map((todo) => {
        if(todo.id === payload.id) {
          return {...todo, name: payload.name}
        }
        
        return todo
      })
    default: 
      throw new Error(`No action found for ${type}.`)
  }
}

export const TodoContext = createContext()

function App() {
    const [ filterName, setFilterName ] = useState("")
    const [hideCompletedFilter, setHideCompletedFilter] = useState(false)
    const [todos, dispatch] = useReducer(reducer, [], (initialValue) => {
      const value = localStorage.getItem(LOCAL_STORAGE_KEY)
      if(value == null) return initialValue

      return JSON.parse(value)
    })

    const filteredTodos = todos.filter((todo) => {
      if(hideCompletedFilter && todo.completed) return false
      return todo.name.includes(filterName)
    })

    useEffect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
    },[todos])

    function addNewTodo(name) {
        // if (newTodoName === "") return//taken from NewTodoForm

        dispatch({ type: ACTION.ADD, payload: {name} })

        // setNewTodoName("")
    }

    function toggleTodo(todoId, completed) {
        dispatch({ type: ACTION.TOGGLE, payload: { id: todoId, completed } })

    }

    function updateTodo( id, name) {
      dispatch({ type: ACTION.UPDATE, payload: { id, name }})
    }

    function deleteTodo(todoId) {
        dispatch({ type: ACTION.DELETE, payload: { id: todoId } })
    }

    return (
        <TodoContext.Provider
            value={{
                todos: filteredTodos,
                // dispatch,//this can change all func down, is up to you
                addNewTodo,
                toggleTodo,
                updateTodo,
                deleteTodo,
            }}
        >
            <TodoFilterForm
                name={filterName}
                setName={setFilterName}
                hideCompleted={hideCompletedFilter}
                setHideCompleted={setHideCompletedFilter}
            />
            <TodoList />
            <NewTodoForm />
        </TodoContext.Provider>
    )
}

export default App
