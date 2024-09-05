"use client"
import React, { useEffect, useRef, useState } from 'react'
import pako from 'pako';
import { isIframe } from '../utils/hooks/canvas-adapter';
import { CanvasClient } from '@dscvr-one/canvas-client-sdk';
import { CopyAll } from '@mui/icons-material'

const containerStyle = {
    maxWidth: '450px',
    margin: '0 auto',
    width: '100%',
    height: '600px',
};
const BlinksWrapper = () => {
    const [importedAction, setImportedAction] = useState('')
    const [generatedAction, setGeneratedAction] = useState('');
    const canvasClientRef = useRef<CanvasClient | undefined>();
    const [isSetFrame, setIsInIframe] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [notify, setNotify] = useState({
        message: '',
        type: ''
    })
    const iframe = isIframe();

    useEffect(() => {
        if (iframe) {
            canvasClientRef.current = new CanvasClient();
        };
        setIsInIframe(iframe);

        const resizeObserver = new ResizeObserver((_) => {
            canvasClientRef?.current?.resize();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, [])


    async function copyClip(text: string) {
        if (isSetFrame) {

            let textCopied = await canvasClientRef?.current?.copyToClipboard(text);
            console.log(textCopied);
        } else {
            navigator.clipboard.writeText(text);
        }
        handleMessage("success", "Text copied successfully")
    }


    const testAction = () => {
        if (importedAction == "") {
            handleMessage("error", "Please Provide a Valid Action URL");
            return;
        }

        if (importedAction.includes('dial.to')) {
            //extract 
            let actionurl = extractUrl(importedAction);
            if (!actionurl) {
                handleMessage("error", "This Action URL is invalid.");
                return;
            }
            setGenerated(actionurl);
            handleMessage("success", "Your action URL is valid, Copy Generated canvas link");
        } else {
            setGenerated(importedAction);
            handleMessage("success", "Your action URL is valid, Copy Generated  canvas link");

        }

        setImportedAction('')


    }


    function extractUrl(input: string) {
        const regex = /solana-action:(https?:\/\/[^\s]+)/;
        const match = input.match(regex);
        return match ? match[1] : null;
    }
    const setGenerated = (action: string) => {
        setGeneratedAction(`https://dscvr-blinks.vercel.app?action=${action}`);
    }

    const handleMessage = (type: string, message: string) => {
        if (type === 'success') {
            setNotify({
                message: message,
                type: 'success'
            })
            setTimeout(() => {
                setNotify({
                    message: '',
                    type: ''
                })
            }, 2000)
        } else {
            setNotify({
                message: message,
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
    }

    const [howto, setShowHowTo] = useState(false)


    return (
        <div ref={containerRef} style={containerStyle} className='bg-[url("/grid_bg.png")] flex flex-col justify-center items-center'>
            {notify.type !== '' &&
                <div className={`${notify.type == "success" ? 'bg-green-500' : "bg-red-500"} w-[400px] rounded-lg  p-2 absolute top-20`}>
                    <p className='text-center'>{notify.message}</p>
                </div>
            }
            <div className='absolute w-screen justify-end flex top-10 right-10'>
                <button onClick={() => setShowHowTo(!howto)} className='bg-red-400  max-w-[200px] hover:bg-red-500/50 hover:text-white text-white p-1 text-[14px] shadow-lg rounded-xl'>
                    How to use
                </button>
            </div>

            {howto && <div className='bg-white h-screen px-5 w-screen py-20 flex flex-col justify-center items-center text-black top-0 absolute  '>

                <p className='font-bold text-[35px] underline'>How To Use</p>
                <p className='mb-4'>Using this canvas can be done in 6 easy steps!!!</p>

                <ol className='space-y-4'>
                    <li>1: Copy your blinks (GET) url,or you can also copy your dial.to url</li>
                    <li>2: Paste the url into the input box</li>
                    <li>3: Click on Generate</li>
                    <li>4: Highlight and copy the generated link</li>
                    <li>5: Create a Post and Paste Link</li>
                    <li>6: Tadaaaaa Blink will unfurl</li>
                </ol>

                <button onClick={() => setShowHowTo(false)} className='bg-red-400 mt-5  w-[200px] hover:bg-red-500/50 hover:text-white text-white p-2 shadow-lg rounded-xl'>
                    Close
                </button>

            </div>
            }
            <div className='flex flex-col justify-center items-center space-y-6'>

                <h1 className='sm:text-[16px] text-center text-[20px] md:text-[40px]'>Import your existing blinks with a click!</h1>
                <input onChange={(event) => {
                    setImportedAction(event.target.value)
                }} value={importedAction} placeholder='paste your action get url' className='p-2 text-center border-white w-8/12  border rounded-xl  bg-black/10' />
                <div className='flex flex-row gap-x-2'>
                    <button onClick={() => testAction()} className='bg-white  w-[100px] hover:bg-white/50 hover:text-white text-black p-2 shadow-lg rounded-xl'>
                        Generate
                    </button>
                </div>


                {generatedAction != '' && <div className='w-10/12 flex flex-row space-y-4 justify-center items-center'>
                    <div className='w-10/12'>
                        <a className='text-wrap text-center w-[300px] overflow-hidden' href={generatedAction}>{generatedAction}</a>
                        <CopyAll onClick={() => copyClip(generatedAction)} className='text-[18px] cursor-pointer -top-5' />
                    </div>
                </div>
                }
            </div>

            <p className='absolute bottom-2 text-[14px]'>powered by <a target="_blank" href='https://www.quick-blinks.xyz'>Quickblinks</a></p>
        </div>
    )
}
export default BlinksWrapper


