import React from 'react'
import style from "./style.module.css"

export const PrimaryButton = ({ label, ...rest }) => {
    return (
        <div className={style.button}>
            <button
                {...rest}
            > {
                    rest?.disabled ? "please wait..." : label
                }
            </button>
        </div>
    )
}
