import { EventRegistration, NETWORK, fetchEvent, fetchTickets } from '@/app/utils/requestsHandler';
import { isImageUrl } from '@/app/utils/utils';
import { TransferSol, TransferUsdc } from '@/app/utils/web3Utils';
import { ACTIONS_CORS_HEADERS, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';


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

        let hostPlacer = `${process.env.NEXT_PUBLIC_HOST_URL}/eventhub.jpg`;
        console.log(hostPlacer);

        const image = await isImageUrl(item.flyer_uri);
        const img_url = image ? item.flyer_uri : hostPlacer;


        let ticket = await fetchTickets(eventId);
        let ticketItem = ticket.data;

        let options = []
        for (let i = 0; i < ticketItem.length; i++) {
            let tickItem = {
                label: ticketItem[i].ticket_name + "-" + ticketItem[i].price + "-" + item.payment_method,
                value: ticketItem[i].unique_id,
            }
            options.push(tickItem)
        }

        const payload = {
            icon: img_url,
            title: `Register for ${item.event_name} -- ${new Date(item.date).toUTCString()}`,
            description: `${item.description}`,
            links: {
                actions: [
                    {
                        href: `/api/events/register?event-id=${eventId}`,
                        label: `Register for Event`,
                        disabled: true,
                        "parameters": [
                            {
                                "name": "name", // field name
                                "label": "enter name / pseudo name are allowed", // text input placeholder
                                type: "text",
                                required: true,
                            },
                            {
                                name: "email_address", //
                                label: 'enter your email address', // text input placeholder,
                                type: "email",
                                required: true,
                            },
                            {
                                name: "ticket_id",
                                label: 'Select Ticket Type', // text input placeholder
                                type: "radio",
                                options: options
                            },
                        ]
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
        let data: any = body?.data;

        let payload: ActionPostResponse
        // //Check if it is sol Payments of USDC
        if (item.payment_method == "USDC") {

            let response = await TransferUsdc(
                NETWORK,
                new PublicKey(body.account),
                new PublicKey(item.payment_address),
                Number(item.fee),
            )

            payload = await createPostResponse({
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

            payload = await createPostResponse({
                fields: {
                    transaction: response,
                    message: "Event Created Successfully",
                },
            })
        }

        //Register User For Transaction, but don't confirm the transaction yet. Transaction will be confirmed via CRON Task and that would be where the Tickets will be Minted for the user 
        let eventRegistration = await EventRegistration(data?.name, data?.email_address, data?.ticket_id, eventId, body.account)


        return Response.json({}, { status: 200, headers: ACTIONS_CORS_HEADERS })
    } catch (e: any) {
        const error: ActionError = {
            message: `${e.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
