"use client"
import React, { useState } from 'react'

const BlinksWrapper = () => {
    const [importedAction, setImportedAction] = useState('')
    const [generatedAction, setGeneratedAction] = useState('');
    const [notify, setNotify] = useState({
        message: '',
        type: ''
    })
    const generateActionUrl = () => {
        if (importedAction == "") {
            setNotify({
                message: 'Please enter a valid action url',
                type: 'error'
            })
            setTimeout(() => {
                setNotify({
                    message: '',
                    type: ''
                })
            }, 2000)
            return;
        }

        setGeneratedAction(`https://quick-blinks.xyz/wrapper/actions?generated=${importedAction}`)
        setNotify({
            message: 'Generated action URL successfully',
            type: 'success'
        })
        setTimeout(() => {
            setNotify({
                message: '',
                type: ''
            })
        }, 2000)
    }
    return (
        <div className='bg-[url("/grid_bg.png")] h-screen flex flex-col justify-center items-center'>
            {notify.type !== '' &&
                <div className={`${notify.type == "success" ? 'bg-green-500' : "bg-red-500"} w-[400px] rounded-lg  p-2 absolute top-20`}>
                    <p className='text-center'>{notify.message}</p>
                </div>
            }
            <div className='flex flex-col justify-center items-center space-y-6'>

                <h1 className='text-[40px]'>Import your existing blinks with a click!</h1>
                <input onChange={(event) => {
                    setImportedAction(event.target.value)
                }} placeholder='paste your action get url' className='p-2 text-center border-white w-8/12  border rounded-xl  bg-black/10' />
                <button onClick={() => generateActionUrl()} className='bg-white w-[200px] hover:bg-white/50 hover:text-white text-black p-2 shadow-lg rounded-xl'>
                    Generate
                </button>

                {generatedAction != '' && <div>
                    <a className='text-center' href={generatedAction}>{generatedAction}</a>
                </div>
                }
            </div>

            <p className='absolute bottom-2 text-[14px]'>powered by <a target="_blank" href='https://www.quick-blinks.xyz'>Quickblinks</a></p>
        </div>
    )
}
export default BlinksWrapper