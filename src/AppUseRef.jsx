import { useEffect, useReducer, useState } from "react"
import "./styles.css"
import { TodoItem } from "./TodoItem"
import { NewTodoForm } from "./NewTodoForm"

const LOCAL_STORAGE_KEY = "TODOS"
const ACTION = {
    ADD: "ADD",
    UPDATE: "UPDATE",
    TOGGLE: "TOGGLE",
    DELETE: "DELETE",
}

function reducer(todos, { type, payload }) {
    switch (type) {
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
        default:
            throw new Error(`No action found for ${type}.`)
    }
}

function App() {
    const [todos, dispatch] = useReducer(reducer, [], (initialValue) => {
        const value = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (value == null) return initialValue

        return JSON.parse(value)
    })

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
    }, [todos])

    function addNewTodo(name) {
        // if (newTodoName === "") return//taken from NewTodoForm

        dispatch({ type: ACTION.ADD, payload: { name } })

        // setNewTodoName("")
    }

    function toggleTodo(todoId, completed) {
        dispatch({ type: ACTION.TOGGLE, payload: { id: todoId, completed } })
    }

    function deleteTodo(todoId) {
        dispatch({ type: ACTION.DELETE, payload: { id: todoId } })
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

            <NewTodoForm addNewTodo={addNewTodo} />
        </>
    )
}

export default App
