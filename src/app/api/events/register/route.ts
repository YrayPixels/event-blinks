import { NETWORK, fetchEvent } from '@/app/utils/requestsHandler';
import { TransferSol, TransferUsdc } from '@/app/utils/web3Utils';
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
                        href: `${process.env.NEXT_PUBLIC_HOST_URL}/api/events/register?event-id=${eventId}`,
                        label: `Register for Event ${Number(item.fee).toFixed(2)} ${item.payment_method}`,
                        // "parameters": [
                        //     {
                        //         "name": "Name", // field name
                        //         "label": "enter name / pseudo name are allowed", // text input placeholder
                        //         type: "text",
                        //         required: true,
                        //     },
                        //     {
                        //         name: "Email Address", //
                        //         label: 'enter your email address', // text input placeholder,
                        //         type: "email",
                        //         required: true,
                        //     },
                        // ]
                    },
                    {
                        "label": "$10", // button text
                        "href": "/api/buy?amount=10"
                    },

                ],


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

            let response = await TransferUsdc(
                NETWORK,
                new PublicKey(body.account),
                new PublicKey(item.payment_address),
                Number(item.fee),
            )
            var payload: ActionPostResponse = await createPostResponse({
                fields: {
                    transaction: response,
                    message: "Event Created Successfully",
                },
            })

        } else {

            let response = await TransferSol(
                NETWORK,
                new PublicKey(body.account),
                new PublicKey(item.payment_address),
                Number(item.fee)
            )

            var payload: ActionPostResponse = await createPostResponse({
                fields: {
                    transaction: response,
                    message: "Event Created Successfully",
                },
            })
        }

        //Register User For Transaction, but don't confirm the transaction yet. Transaction will be confirmed via CRON Task and that would be where the Tickets will be Minted for the user


        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })



    } catch (e: any) {
        const error: ActionError = {
            message: `${e.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
