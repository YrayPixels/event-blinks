import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { NextApiRequest } from 'next';
import pako from 'pako';


export const GET = (req: Request) => {
    try {
        const url = new URL(req.url);
        const params = new URLSearchParams(url.search);
        const create = params.get('event-id');


        const payload = {
            icon: "http://localhost:3000/events.png",
            title: "Create Quick Events With Blinks",
            description: "Create and manage your events and events Items directly from blinks, get access to the number of those that have purchased your tickets and registered for your events directly from your blinks.",
            label: `Create Event`,

            links: {
                actions: [
                    {
                        href: `http://localhost:3000/api/events/create`,
                        label: 'Create Event',
                        "parameters": [
                            {
                                "name": "Event Name", // field name
                                "label": "enter name/title for your event", // text input placeholder
                                type: "text",
                                required: true,

                            },
                            {
                                name: "Event Description", //
                                label: 'enter a short description of the event', // text input placeholder,
                                type: "textarea",
                                required: true,

                            },
                            {
                                name: "Event Date and Time of Events",
                                label: 'enter event date in the format YYYY-MM-DD', // date input placeholder
                                type: "datetime-local",
                                required: true,

                            },
                            {
                                name: "Event Location",
                                label: 'enter event location', // text input placeholder
                                type: "text",
                                required: true,
                            },
                            {
                                name: "Flyer URI",
                                label: 'enter the link to the flyer for your event', // text input placeholder
                                type: "url",
                                required: true,
                            },
                        ]
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


    try {

        const body: ActionPostRequest = await req.json();

        let walletAddress = new PublicKey("13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ");


        const lamportsToSend = Number(0.025) * LAMPORTS_PER_SOL;

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
