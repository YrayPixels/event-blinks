import { ACTIONS_CORS_HEADERS, ActionGetResponse } from '@solana/actions';
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
        label: `Mint ${item.price} SOL `,
        links: {
            actions: [
                {
                    href: `https://www.dial.to/?action=solana-action:http://localhost:3000/api/actions/mint?create=${create}`,
                    label: `Mint ${item.price} SOL`
                },
                {
                    href: `https://www.dial.to/?action=solana-action:http://localhost:3000/api/actions/mint?create=${create}`,
                    label: `Donate ${item.price} SOL`
                }
            ]

        }

    }
    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
}
export const OPTIONS = GET;

export const POST = (req: Request) => {
    return Response.json({ message: "POST request received" }, { headers: ACTIONS_CORS_HEADERS })
}
