"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react'
import '@dialectlabs/blinks/index.css';
import { Action, Blink, ActionsRegistry, useAction, useActionsRegistryInterval, ActionContainer } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana"
import { NETWORK } from '@/app/utils/requestsHandler';
import '@dialectlabs/blinks/index.css';
import pako from 'pako';
import { CanvasClient } from '@dscvr-one/canvas-client-sdk';
import { isIframe } from '@/app/utils/blinkWrapper/canvas-adapter';


const BlinksWrapper = ({ params }: { params: { slug: string } }) => {

    let adjusted = params.slug
    // Step 1: Decode base64 to buffer
    const compressedRe = Buffer.from(adjusted, 'base64');
    // Step 2: Unzip the buffer
    const decompressedRe = pako.ungzip(compressedRe);
    // Step 3: Convert buffer to string
    const actionItem = Buffer.from(decompressedRe).toString('utf-8');

    const { isRegistryLoaded } = useActionsRegistryInterval();
    // const [action, setAction] = useState<Action | null>(null);



    // useAction initiates registry, adapter and fetches the action.
    const { adapter } = useActionSolanaWalletAdapter(NETWORK);



    const [action, setAction] = useState<Action | null>(null);
    const [_, setIsInIframe] = useState(false);
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [websiteText, setWebsiteText] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasClientRef = useRef<CanvasClient | undefined>();

    useEffect(() => {
        const iframe = isIframe();

        if (iframe) {
            canvasClientRef.current = new CanvasClient();
        };

        setIsInIframe(iframe);
        const adapterTool = iframe ? adapter : undefined;

        const fetchAction = async () => {
            // const url = new URL(window.location.href);
            // const actionParam = url.searchParams.get('action') ?? 'https://blink-chat.xyz/api/actions/chat';

            const actionParam = actionItem;

            if (actionParam) {
                try {
                    const actionUrl = new URL(actionParam);

                    setWebsiteUrl(actionUrl.toString());
                    setWebsiteText(actionUrl.host);

                    const action = await Action.fetch(
                        actionParam,
                        adapterTool
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
    }, []);

    const exampleCallbacks = {
        onActionMount: (action: any, url: any, actionState: any) => {
            console.log("Action mounted:", action, url, actionState);
        },
    };

    const exampleSecurityLevel = "only-trusted";

    const containerStyle = {
        maxWidth: '450px',
        margin: '0 auto',
        width: '100%'
    };

    return (
        <div className='bg-[url("/grid_bg.png")]  py-5 flex flex-row justify-center items-center'>
            <div ref={containerRef} style={containerStyle}>
                {isRegistryLoaded && action && (
                    <ActionContainer
                        action={action}
                        websiteUrl={websiteUrl}
                        websiteText={websiteText}
                        callbacks={exampleCallbacks}
                        securityLevel={exampleSecurityLevel}
                        stylePreset="x-dark"
                    />
                )}
            </div>
        </div>

    )
}
export default BlinksWrapper