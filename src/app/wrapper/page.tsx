"use client"
import React, { useEffect, useRef, useState } from 'react'
import pako from 'pako';
import { isIframe } from '../utils/hooks/canvas-adapter';
import { CanvasClient } from '@dscvr-one/canvas-client-sdk';

const BlinksWrapper = () => {
    const [importedAction, setImportedAction] = useState('')
    const [generatedAction, setGeneratedAction] = useState('');
    const canvasClientRef = useRef<CanvasClient | undefined>();
    const [_, setIsInIframe] = useState(false);
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

        // //To Gzip
        // const compressed = pako.gzip(importedAction);
        // //To Base64
        // const base64Encoded = Buffer.from(compressed).toString('base64');

        setGeneratedAction(`https://dscvr-blinks.vercel.app?action=${importedAction}`);
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

    const containerStyle = {
        maxWidth: '450px',
        margin: '0 auto',
        width: '100%',
        height: '600px',
    };
    return (
        <div ref={containerRef} style={containerStyle} className='bg-[url("/grid_bg.png")] flex flex-col justify-center items-center'>
            {notify.type !== '' &&
                <div className={`${notify.type == "success" ? 'bg-green-500' : "bg-red-500"} w-[400px] rounded-lg  p-2 absolute top-20`}>
                    <p className='text-center'>{notify.message}</p>
                </div>
            }
            <div className='flex flex-col justify-center items-center space-y-6'>

                <h1 className='sm:text-[16px] text-center text-[20px] md:text-[40px]'>Import your existing blinks with a click!</h1>
                <input onChange={(event) => {
                    setImportedAction(event.target.value)
                }} placeholder='paste your action get url' className='p-2 text-center border-white w-8/12  border rounded-xl  bg-black/10' />
                <button onClick={() => generateActionUrl()} className='bg-white  max-w-[200px] hover:bg-white/50 hover:text-white text-black p-2 shadow-lg rounded-xl'>
                    Generate
                </button>

                {generatedAction != '' && <div className='w-screen text-wrap  flex flex-col space-y-4 justify-center items-center'>
                    <a className='text-center w-full text-wrap' href={generatedAction}>{generatedAction.slice(0, 50)}...</a>

                    {/* <p>Copy generated link</p> */}
                </div>
                }
            </div>

            <p className='absolute bottom-2 text-[14px]'>powered by <a target="_blank" href='https://www.quick-blinks.xyz'>Quickblinks</a></p>
        </div>
    )
}
export default BlinksWrapper


