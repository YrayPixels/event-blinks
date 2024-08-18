"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Action, Blink, ActionsRegistry, ActionContainer } from "@dialectlabs/blinks";
import '@dialectlabs/blinks/index.css';
import '../blink.css';
import { CanvasAdapter, isIframe } from '../utils/hooks/canvas-adapter';
import { CanvasClient } from '@dscvr-one/canvas-client-sdk';


const BlinksWrapper = () => {
    const [action, setAction] = useState<Action | null>(null);
    const [_, setIsInIframe] = useState(false);
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [websiteText, setWebsiteText] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasClientRef = useRef<CanvasClient | undefined>();

    // const { isRegistryLoaded } = useActionsRegistryInterval();
    // const { adapter } = useActionSolanaWalletAdapter(NETWORK);


    useEffect(() => {
        const iframe = isIframe();

        if (iframe) {
            canvasClientRef.current = new CanvasClient();
        };

        setIsInIframe(iframe);
        const adapter = iframe ? new CanvasAdapter() : undefined;

        const fetchAction = async () => {
            const url = new URL(window.location.href);

            const actionParam = url.searchParams.get('action');

            if (actionParam) {
                try {
                    const actionUrl = new URL(actionParam);

                    setWebsiteUrl(actionUrl.toString());
                    setWebsiteText(actionUrl.host);

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


    // console.log(adapter, actionApiUrl, action);
    return (
        <div className='bg-[url("/grid_bg.png")]  py-5 flex flex-row justify-center items-center'>
            <div ref={containerRef} style={containerStyle}>
                {action && (
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