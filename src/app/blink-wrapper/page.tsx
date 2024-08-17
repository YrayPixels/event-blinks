"use client"
import React, { useState, useEffect, useMemo } from 'react'
import '@dialectlabs/blinks/index.css';
import { Action, Blink, ActionsRegistry, useAction, useActionsRegistryInterval } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana"
import { NETWORK } from '@/app/utils/requestsHandler';
import { useSearchParams } from 'next/navigation'
import { CanvasClient, CanvasInterface } from '@dscvr-one/canvas-client-sdk';
import { registerCanvasWallet } from '@dscvr-one/canvas-wallet-adapter';
import '@dialectlabs/blinks/index.css';
import { useResizeObserver } from '../utils/hooks/useResizeObserver';
import { useCanvasClient } from '../utils/hooks/useCanvasClient';

const BlinksWrapper = () => {
    const searchParams = useSearchParams()
    const actionItem = searchParams.get('generated')
    if (actionItem == null) {
        console.log('No action found');
        return <div>No action found</div>
    }

    const { client, user, content, isReady } = useCanvasClient();
    useResizeObserver(client);

    const { isRegistryLoaded } = useActionsRegistryInterval();
    // const [action, setAction] = useState<Action | null>(null);
    const actionApiUrl = actionItem;
    // useAction initiates registry, adapter and fetches the action.
    const { adapter } = useActionSolanaWalletAdapter(NETWORK);


    const apiUrls = useMemo(() => ([actionApiUrl]), []);
    const [actions, setActions] = useState<Action[]>([]);

    useEffect(() => {
        const fetchActions = async () => {
            const promises = apiUrls.map(url => Action.fetch(url).catch(() => null));
            const actions = await Promise.all(promises);

            setActions(actions.filter(Boolean) as Action[]);
        }

        fetchActions();
    }, [apiUrls]);

    // we need to update the adapter every time, since it's dependent on wallet and walletModal states
    useEffect(() => {
        actions.forEach((action) => action.setAdapter(adapter));
    }, [actions, adapter]);



    // console.log(adapter, actionApiUrl, action);
    return (
        <div className='bg-[url("/grid_bg.png")] border py-5 flex flex-row justify-center items-center'>
            {isRegistryLoaded && actions.length > 0 && actions.map(action => (
                <div key={action.url} className="bg-[url('/grid_bg.png')] w-11/12 md:w-5/12 lg:4/12 ">
                    <Blink stylePreset="x-dark" action={action} websiteText={new URL(action.url).hostname} />
                </div>
            ))}

        </div>
    )
}
export default BlinksWrapper