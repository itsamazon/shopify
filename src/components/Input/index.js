import React from 'react'
import styles from "./style.module.css"

export const TextField = ({ id, labelName, register, name }) => {
    return (
        <div className={styles.inputContainer}>
            <label htmlFor={id}> {labelName} </label>
            <textarea
                {...register(name)}
                type="text"

                id={id}
                name={id}
                rows="10"
                cols="50"
            />
        </div>
    )
}

