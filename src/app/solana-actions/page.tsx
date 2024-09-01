"use client"
import React, { useState, useEffect, useRef } from 'react'
import '@dialectlabs/blinks/index.css';
import '../blink.css';

import { Action, Blink, useActionsRegistryInterval } from "@dialectlabs/blinks";

import { Connection, clusterApiUrl } from '@solana/web3.js';
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana"
import { WalletConnectButton } from '@solana/wallet-adapter-react-ui';

import * as Web3MobileWallet from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import {
    transact,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";


const BlinksWrapper = () => {
    const [websiteText, setWebsiteText] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const [action, setAction] = useState<Action | undefined>();
    const connection = new Connection(clusterApiUrl('mainnet-beta'));
    const { adapter } = useActionSolanaWalletAdapter(connection);
    const { isRegistryLoaded } = useActionsRegistryInterval();

    useEffect(() => {
        // console.log(Web3MobileWallet);
        (async () => {
            const result = await transact(async (wallet: any) => {
                const authResult = wallet.authorize({
                    chain: 'solana:devnet',
                    identity: {
                        name: 'Example dApp',
                        uri: 'https://yourdapp.com',
                        icon: "favicon.ico", // Resolves to https://yourdapp.com/favicon.ico
                    },
                })
                return authResult;
            });

            console.log(result);
        })()

    }, [])
    useEffect(() => {

        const fetchAction = async () => {
            const url = new URL(window.location.href);

            const actionParam = url.searchParams.get('action') ?? "https://www.quick-blinks.xyz/api/events/create";

            if (actionParam) {
                try {
                    const actionUrl = new URL(actionParam);
                    setWebsiteText(actionUrl.hostname)
                    const action = await Action.fetch(
                        actionParam,
                        adapter
                    );
                    setAction(action);
                } catch (error) {
                    console.error("Invalid action URL:", error);
                }
            } else {
                console.error("No action parameter provided in URL");
            }
        };
        fetchAction();
    }, []);

    const containerStyle = {
        maxWidth: '450px',
        margin: '0 auto',
        width: '100%'
    };


    return (
        <div ref={containerRef} style={containerStyle}>
            {isRegistryLoaded && action && (
                <>
                    {/* <div><WalletConnectButton /></div> */}
                    <Blink stylePreset='x-dark' action={action} websiteText={websiteText} />
                </>
            )}
        </div>
    )
}
export default BlinksWrapper