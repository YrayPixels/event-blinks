import { fetchEvent } from '@/app/utils/requestsHandler';
import { ACTIONS_CORS_HEADERS, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { NextApiRequest } from 'next';
import pako from 'pako';


export const GET = async (req: Request) => {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const eventId = params.get('event-id');

    if (!eventId) {
        const error: ActionError = {
            message: `No Event Id Provided`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }

    try {
        let res = await fetchEvent(eventId)
        let item = res.data;
        const payload = {
            icon: item.flyer_uri,
            title: `Register for ${item.event_name} -- ${new Date(item.date).toUTCString()}`,
            description: `${item.description}`,
            links: {
                actions: [
                    {
                        href: `${process.env.HOST_URL}/api/events/register/${eventId}`,
                        label: 'Register for Event 0.04SOL',
                        "parameters": [
                            {
                                "name": "Name", // field name
                                "label": "enter name / pseudo name are allowed", // text input placeholder
                                type: "text",
                                required: true,
                            },
                            {
                                name: "Email Address", //
                                label: 'enter your email address', // text input placeholder,
                                type: "email",
                                required: true,
                            },
                        ]
                    }
                ]
            },
        };

        return new Response(JSON.stringify(payload), {
            headers: ACTIONS_CORS_HEADERS
        });


    } catch (er: any) {
        const error: ActionError = {
            message: `${er.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const eventId = params.get('event-id');
    if (!eventId) {
        const error: ActionError = {
            message: `No Event Id passed`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }


    try {

        const body: ActionPostRequest = await req.json();
        let res = await fetchEvent(eventId)
        let item = res.data;


        //Check if it is sol Payments of USDC

        if (item.payment_method == "USDC") {


        } else {

        }
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

        const payload: ActionPostResponseWithSerializedTransaction = {
            transaction: transferTransaction,
            message: "Event Created Successfully",
        }



        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })

    } catch (e: any) {
        const error: ActionError = {
            message: `${e.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
