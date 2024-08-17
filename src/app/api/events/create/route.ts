import { NETWORK, createEvent } from '@/app/utils/requestsHandler';
import { ACTIONS_CORS_HEADERS, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';


export const GET = (req: Request) => {
    try {
        const url = new URL(req.url);
        const payload = {
            icon: `${process.env.NEXT_PUBLIC_HOST_URL}/events.png`,
            title: "Create Quick Events With Blinks",
            description: "Create and manage your events and events Items directly from blinks, get access to the number of those that have purchased your tickets and registered for your events directly from your blinks.",
            label: `Create Event`,

            links: {
                actions: [
                    {
                        href: `/api/events/create`,
                        label: 'Create Event',
                        "parameters": [
                            {
                                "name": "email_address", // field name
                                "label": "enter your email address", // text input placeholder
                                type: "email",
                                required: true,

                            },
                            {
                                "name": "event_name", // field name
                                "label": "enter name/title for your event", // text input placeholder
                                type: "text",
                                required: true,

                            },
                            {
                                name: "description", //
                                label: 'enter a short description of the event', // text input placeholder,
                                type: "textarea",
                                required: true,

                            },
                            {
                                name: "date_time",
                                label: 'enter event date in the format YYYY-MM-DD', // date input placeholder
                                type: "datetime-local",
                                required: true,

                            },
                            {
                                name: "location",
                                label: 'enter event location', // text input placeholder
                                type: "text",
                                required: true,
                            },
                            {
                                name: "flyer_url",
                                label: 'enter the link to the flyer for your event - leave empty if none', // text input placeholder
                                type: "url",
                            },
                            {
                                name: "fee",
                                label: 'Enter Fee Leave empty if it is free', // text input placeholder
                                type: "number",
                            },
                            {
                                name: "payment_token",
                                label: 'Select Payment Token', // text input placeholder
                                type: "radio",
                                options: [
                                    {
                                        label: "SOL",
                                        value: "SOL",
                                    },
                                    {
                                        label: "USDC",
                                        value: "USDC",
                                    },
                                ]
                            },
                            {
                                name: "payment_address",
                                label: 'Enter Address You want to receive payment to', // text input placeholder
                                type: "text",
                            },
                        ],

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

        let data: any = body?.data;

        let address = process.env.WALLET_ADDRESS || "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ";
        let walletAddress = new PublicKey(address);
        const lamportsToSend = Number(0.005) * LAMPORTS_PER_SOL;

        const transferTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(body.account),
                toPubkey: walletAddress,
                lamports: lamportsToSend,
            }),
        );

        const connection = new Connection(NETWORK);
        transferTransaction.feePayer = new PublicKey(body.account);
        transferTransaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
        const date = new Date(data?.date_time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        // Format time as "HH:MM"
        const time = `${hours}:${minutes}`

        try {
            const response = await createEvent(
                data?.event_name,
                data?.description,
                data?.date_time,
                data?.location,
                data?.flyer_url,
                time,
                data?.payment_token,
                data?.payment_address,
                body.account,
                data?.fee,
                data?.email_address,
            );

        } catch (eventError: any) {
            console.error('Error in createEvent:', eventError);
            const error: ActionError = {
                message: `${eventError.message}`,
            }
            return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
        }
        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction: transferTransaction,
                message: "Event Created Successfully",
            },
        })

        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })
    } catch (e: any) {
        const error: ActionError = {
            message: `${e.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
