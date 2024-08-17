"use client"
import React, { useState, useEffect, useMemo } from 'react'
import '@dialectlabs/blinks/index.css';
import { Action, Blink, ActionsRegistry, useAction, useActionsRegistryInterval } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana"
import { NETWORK } from '@/app/utils/requestsHandler';
import '@dialectlabs/blinks/index.css';
import pako from 'pako';


const BlinksWrapper = ({ params }: { params: { slug: string } }) => {

    let adjusted = params.slug
    // Step 1: Decode base64 to buffer
    const compressedRe = Buffer.from(adjusted, 'base64');
    // Step 2: Unzip the buffer
    const decompressedRe = pako.ungzip(compressedRe);
    // Step 3: Convert buffer to string
    const actionItem = Buffer.from(decompressedRe).toString('utf-8');
    // const { client, user, content, isReady } = useCanvasClient();

    console.log(actionItem);
    // useResizeObserver(client);
    const { isRegistryLoaded } = useActionsRegistryInterval();
    // const [action, setAction] = useState<Action | null>(null);
    const actionApiUrl = actionItem;
    // useAction initiates registry, adapter and fetches the action.
    const { adapter } = useActionSolanaWalletAdapter(NETWORK);

    const [action, setAction] = useState<Action | null>(null)
    useEffect(() => {
        const fetchActions = async () => {
            let action = await Action.fetch(actionApiUrl).catch(() => null);
            setAction(action)
        }
        fetchActions();
    }, [actionApiUrl]);

    // we need to update the adapter every time, since it's dependent on wallet and walletModal states
    useEffect(() => {
        action?.setAdapter(adapter);
    }, [action, adapter]);



    // console.log(adapter, actionApiUrl, action);
    return (
        <div className='bg-[url("/grid_bg.png")]  py-5 flex flex-row justify-center items-center'>
            {isRegistryLoaded && action && (
                <div key={action.url} className="bg-[url('/grid_bg.png')] sm:w-10/12 w-8/12 md:w-5/12 lg:4/12 ">
                    <Blink stylePreset="x-dark" action={action} websiteText={new URL(action.url).hostname} />
                </div>
            )}

        </div>
    )
}
export default BlinksWrapper