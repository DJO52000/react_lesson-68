import { useEffect, useState } from "react"
import "./styles.css"
import { TodoItem } from "./TodoItem"

const LOCAL_STORAGE_KEY = "TODOS"

function App() {
    const [newTodoName, setNewTodoName] = useState("")
    const [todos, setTodos] = useState(() => {
        const value = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (value == null) return []

        return JSON.parse(value)
    })

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
    }, [todos])

    function addNewTodo() {
        if (newTodoName === "") return

        setTodos((currentTodos) => {
            return [
                ...currentTodos,
                {
                    name: newTodoName,
                    completed: false,
                    id: crypto.randomUUID(),
                },
            ]
        })
        setNewTodoName("")
    }

    function toggleTodo(todoId, completed) {
        setTodos((currentTodos) => {
            return currentTodos.map((todo) => {
                if (todo.id === todoId) return { ...todo, completed }

                return todo
            })
        })
    }

    function deleteTodo(todoId) {
        setTodos((currentTodos) => {
            return currentTodos.filter((todo) => todo.id !== todoId)
        })
    }

    return (
        <>
            <ul id="list">
                {todos.map((todo) => {
                    return (
                        <TodoItem
                            key={todo.id}
                            {...todo}
                            toggleTodo={toggleTodo}
                            deleteTodo={deleteTodo}
                        />
                    )
                })}
            </ul>

            <div id="new-todo-form">
                <label htmlFor="todo-input">New Todo</label>
                <input
                    type="text"
                    id="todo-input"
                    value={newTodoName}
                    onChange={(e) => setNewTodoName(e.target.value)}
                />
                <button onClick={addNewTodo}>Add Todo</button>
            </div>
        </>
    )
}

export default App
