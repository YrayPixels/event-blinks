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

