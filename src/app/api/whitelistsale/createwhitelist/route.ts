import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { NextApiRequest } from 'next';
import pako from 'pako';


export const GET = (req: Request) => {
    try {
        const url = new URL(req.url);
        const params = new URLSearchParams(url.search);
        const create = params.get('create');



        const payload = {
            icon: new URL('https://www.quick-blinks.xyz/_next/image?url=%2Fquick.jpg&w=256&q=75'),
            title: 'Create a Whitelist for your token',
            description: 'This blinks creates a whitelist for your tokensale and helps only whitelisted users to participate, On creating a blink url will be shared to manage your whitelist',
            label: `Create Whitelist`,
            links: {
                actions: [
                    {
                        href: 'https://www.quick-blinks.xyz/api/whitelistsale/createwhitelist',
                        label: 'Create Whitelist Now'
                    }
                ]
            }
        };

        return new Response(JSON.stringify(payload), {
            headers: ACTIONS_CORS_HEADERS
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: "Error parsing request", error: error?.response?.message }), {
            headers: ACTIONS_CORS_HEADERS,
            status: 500
        });
    }
};
export const OPTIONS = GET;

export const POST = async (req: Request) => {

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    const send: any = params.get('send') || "{walletAddressReq: '' , price: 0}";
    let decoded = decodeURIComponent(send);
    let item = JSON.parse(decoded);

    if (item.walletAddress === '') {
        return Response.json({ message: "No wallet address found" }, { headers: ACTIONS_CORS_HEADERS })
    }

    try {

        const body: ActionPostRequest = await req.json();

        let walletAddress = new PublicKey(item.walletAddress);


        const lamportsToSend = Number(item.price) * LAMPORTS_PER_SOL;

        const transferTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(body.account),
                toPubkey: walletAddress,
                lamports: lamportsToSend,
            }),
        );

        const connection = new Connection(clusterApiUrl('devnet'));
        transferTransaction.feePayer = new PublicKey(body.account);
        transferTransaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction: transferTransaction,

            },

        })

        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })

    } catch (e) {
        return Response.json({ message: "Error sending transaction" }, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
