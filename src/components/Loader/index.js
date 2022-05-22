import React from 'react'
import style from "./styles.module.css"

export const Loaders = ({ classname = "" }) => {
    return (
        <div className={`${style.loading} ${classname}`}>
            <div className={style.arc}></div>
            <div className={style.arc}></div>
            <div className={style.arc}></div>
        </div>
    )
}