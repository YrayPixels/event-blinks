import { ACTIONS_CORS_HEADERS, ActionGetResponse } from '@solana/actions';
import { NextApiRequest } from 'next';

export const GET = (req: Request) => {

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    // Accessing parameters from the request
    const title = params.get('title') || "NFT";
    const description = params.get('description') || "Mint this NFT";
    const amount = params.get('amount');


    const payload: ActionGetResponse = {

        icon: new URL("/nft.avif", url.origin).toString(),
        /** describes the source of the action request */
        title: title,
        /** brief summary of the action to be performed */
        description: description,
        /** button text rendered to the user */
        label: `Mint ${amount} SOL `,
    }
    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
}

export const OPTIONS = GET;

export const POST = (req: Request) => {


    return Response.json({ message: "POST request received" }, { headers: ACTIONS_CORS_HEADERS })

}
