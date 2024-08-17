"use client"
import React, { useState, useEffect } from 'react'
import '@dialectlabs/blinks/index.css';
import { Action, Blink, ActionsRegistry, useAction } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana"
import { Connection } from '@solana/web3.js';
import { NETWORK } from '@/app/utils/requestsHandler';
import { useSearchParams } from 'next/navigation'
import { CanvasClient, CanvasInterface } from '@dscvr-one/canvas-client-sdk';
import { registerCanvasWallet } from '@dscvr-one/canvas-wallet-adapter';

const BlinksWrapper = () => {
    const searchParams = useSearchParams()
    console.log(searchParams);

    const actionItem = searchParams.get('generated')
    if (actionItem == null) {
        console.log('No action found');
        return <div>No action found</div>
    }
    // const [action, setAction] = useState<Action | null>(null);
    const connection = new Connection(NETWORK, "confirmed");
    const { adapter } = useActionSolanaWalletAdapter(connection);
    const actionApiUrl = actionItem;

    const { action } = useAction({ url: actionApiUrl || "", adapter });

    // useEffect(() => {
    //     (async () => {
    //         const canvasClient = new CanvasClient();
    //         // registerCanvasWallet(canvasClient);
    //         const response = await canvasClient.ready();
    //         console.log('Canvas client ready', response);

    //         if (response) {
    //             // if ("Handshake" in CanvasInterface) {
    //             //     // The handshake allows access to the user and the content that the application is embedded in.
    //             //     const user: CanvasInterface.Handshake.User = response.untrusted.user;
    //             //     const content: CanvasInterface.Handshake.Content = response.untrusted.content;
    //             //     // ...
    //             // }
    //         }

    //     })()
    // }, [])

    const connectDscvr = async () => {
        console.log('clicked');
        alert('clicked');
    }
    return (
        <div className='bg-[url("/grid_bg.png")] h-screen flex flex-row justify-center items-center'>
            <div className='absolute top-5 right-10'> <button onClick={() => connectDscvr()} className='bg-white hover:bg-white/50 hover:text-white text-black p-2 shadow-lg rounded-xl'>
                Connect Dscvr
            </button></div>
            <div className='flex flex-col justify-center items-center space-y-6'>


                {action ? <Blink action={action} websiteText={new URL(actionApiUrl).hostname} /> : null}

            </div>

        </div>
    )
}
export default BlinksWrapper