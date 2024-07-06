import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { NextApiRequest } from 'next';

export const GET = (req: Request) => {

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const create = params.get('create') || "{}";

    if (create === undefined) {
        return Response.json({ message: "No create parameter found" }, { headers: ACTIONS_CORS_HEADERS })
    }

    let decoded = decodeURIComponent(create);
    let item = JSON.parse(decoded);


    const payload: ActionGetResponse = {

        icon: new URL(item.image, url.origin).toString(),
        title: item.title,
        description: item.description,
        label: `${item.actionTitle}`,
        links: {
            actions: [
                {
                    href: `${item.actionUrl}`,
                    label: `${item.actionTitle}`
                },
            ]

        }

    }
    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
}
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

