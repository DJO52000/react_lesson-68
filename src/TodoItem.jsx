import { useContext, useRef, useState } from "react"
import { TodoContext } from "./App"
import { PropTypes } from "prop-types"

export function TodoItem({ id, name, completed }) {
    const { toggleTodo, deleteTodo, updateTodo } = useContext(TodoContext)
    const [isEditing, setIsEditing] = useState(false)
    const nameRef = useRef()

    function handleSubmit(e) {
        e.preventDefault()

        if(nameRef.current.value === "") return

        updateTodo(id, nameRef.current.value)

        setIsEditing(false)
    }

    return (
        <li className="list-item">
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <input autoFocus type="text" defaultValue={name} ref={nameRef} />
                    <button data-button-edit>
                        Save
                    </button>
                </form>
            ) : (
                <>
                    <label className="list-item-label">
                        <input
                            checked={completed}
                            type="checkbox"
                            data-list-item-checkbox
                            onChange={(e) => toggleTodo(id, e.target.checked)}
                        />
                        <span data-list-item-text>{name}</span>
                    </label>
                    <button onClick={() => setIsEditing(true)} data-button-edit>
                        Edit
                    </button>
                    <button onClick={() => deleteTodo(id)} data-button-delete>
                        Delete
                    </button>
                </>
            )}
        </li>
    )
    
}
TodoItem.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
}
