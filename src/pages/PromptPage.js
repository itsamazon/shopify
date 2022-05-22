import * as yup from 'yup';
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import style from "./styles.module.css"
import { PrimaryButton, TextField, Loaders } from '../components'

const PromptPage = () => {
    const [pageStatus, setPageStatus] = useState('idle');
    const [details, setDetail] = useState([]);
    const [pagesNum, setPagesNum] = useState(0);
    const limit = 5;
    const [dataChunk, setDataChunk] = useState(details.slice(0, 5))
    const [page, setPage] = useState(1);
    const suggestions = ["How to ", "What is ", "Where to ", "When did ", "Who is "]

    const schema = yup.object({
        prompt: yup.string().required("Please add a valid prompt"),
    }).required();

    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm({
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        setPageStatus("loading");
        let storedetails = JSON.parse(localStorage.getItem("detail")) || [];
        setDetail(storedetails);
        setPageStatus("idle");
    }, []);

    useEffect(() => {
        if (details.length > 0) localStorage.setItem('detail', JSON.stringify(details));
        setPagesNum(Math.floor(details.length / limit))
    }, [details]);

    useEffect(() => {
        if (page > 1) {
            const currentPage = limit * page;
            setDataChunk(details.slice(currentPage, currentPage + limit))
        } else setDataChunk(details.slice(0, limit));
    }, [page, details]);

    const onsubmit = async (data) => {
        setPageStatus("loading");
        const payload = {
            prompt: data.prompt,
            temperature: 0.5,
            max_tokens: 64,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        }

        await fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            },
            body: JSON.stringify(payload),
        }).then(
            (res) => res.json()
        ).then(
            (data) => {
                if (data.error) {
                    setError("prompt", {
                        message: `${data.error.message}`
                    })
                }
                else {
                    setDetail(prev => ([{
                        prompt: payload.prompt,
                        response: data.choices[0].text
                    }, ...prev]));
                    setValue("prompt", "");
                }
            }).catch(() =>
                setError("prompt", {
                    message: `Check your internet connection and try again`
                }))
            .finally(() => setPageStatus("idle"))
    };

    return (
        <div className={style.pagecontainer}>
            <h1>Fun with AI</h1>
            <form className={style.promptForm} onSubmit={handleSubmit(onsubmit)}>
                <TextField
                    register={register}
                    id="prompt"
                    name="prompt"
                    labelName="Enter prompt"
                />
                <div className={style.suggestions}>
                    {suggestions.map((suggest, idx) =>
                        <button key={idx} onClick={(e) => { e.preventDefault(); setValue("prompt", `${suggest}`) }}> {suggest}
                        </button>
                    )}
                </div>
                {errors.prompt && <p className={style.error}>{errors.prompt.message}</p>}

                <PrimaryButton
                    disabled={pageStatus === 'loading'}
                    type="submit"
                    label="Submit"
                />
            </form>

            <div className={style.pageloading}>
                <h2>Responses</h2>
                {pageStatus === 'loading' && <Loaders />}
                <div className={style.pagination}>
                    <button type='button' onClick={() => page > 1 && setPage(page - 1)} disabled={page < 2}>&lt;</button>
                    <button type='button' onClick={() => page < pagesNum && setPage(page + 1)} disabled={page === pagesNum || dataChunk.length < limit}>&gt;</button>
                </div>
            </div>

            <section>
                {dataChunk?.length > 0 ?
                    dataChunk.map((single, idx) =>
                        <article className={style.response} key={idx}>
                            <div>
                                <h5>Prompt:</h5>
                                <p>{single.prompt}</p>
                            </div>
                            <div>
                                <h5>Response:</h5>
                                <p> {single.response}</p>
                            </div>
                        </article>
                    ) :
                    <p>
                        No response yet!!
                    </p>
                }
            </section>
        </div>
    )
}

export default PromptPage