import { NETWORK, createEventTicket, fetchEvent, fetchTickets } from '@/app/utils/requestsHandler';
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

        let ticket = await fetchTickets(eventId);
        let ticketItem = ticket.data;

        let options = []
        for (let i = 0; i < ticketItem.length; i++) {
            let tickItem = {
                label: ticketItem[i].ticket_name + ticketItem[i].price,
                value: ticketItem[i].price,
            }
            options.push(tickItem)
        }

        const payload = {
            icon: item.flyer_uri,
            title: `Create Ticket for ${item.event_name}`,
            description: `${item.description}`,
            links: {
                actions: [
                    {
                        href: `${process.env.NEXT_PUBLIC_HOST_URL}/api/events/create-tickets?event-id=${eventId}`,
                        label: `Create Tickets`,
                        "parameters": [
                            {
                                name: "ticket_id",
                                label: 'Created Tickets', // text input placeholder
                                type: "radio",
                                disabled: true,
                                options: options,
                            },
                            {
                                "name": "name", // field name
                                "label": "enter ticket name", // text input placeholder
                                type: "text",
                                required: true,
                            },
                            {
                                "name": "image", // field name
                                "label": "image of ticket", // text input placeholder
                                type: "url",
                            },
                            {
                                name: "price", //
                                label: 'enter ticket price', // text input placeholder,
                                type: "number",
                                required: true,
                            },
                            {
                                name: "quantity", //
                                label: 'enter maximum quantity', // text input placeholder,
                                type: "number",
                                required: true,
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
        const requestData: any = body.data;
        console.log(requestData)
        let res = await fetchEvent(eventId)
        let item = res.data;

        //check if the owner is the same as the writer

        if (item.owner !== body.account) {
            const error: ActionError = {
                message: `You are not the owner of this event`,
            }
            return Response.json(error, { status: 403, headers: ACTIONS_CORS_HEADERS })
        }

        let event = await fetchEvent(eventId);
        if (!event) {
            const error: ActionError = {
                message: `Event not found`,
            }
            return Response.json(error, { status: 404, headers: ACTIONS_CORS_HEADERS })
        }

        let response = await createEventTicket(eventId, requestData?.name, requestData?.price, requestData?.image, requestData?.quantity)

        if (response) {
            // TODO:: Mint the Nft Ticket Here

            //Mint the Nft Ticket here

            //     var payload: ActionPostResponse = await createPostResponse({
            //         fields: {
            //             transaction: response,
            //             message: "Event Created Successfully",
            //         },
            //     })

            return Response.json({ message: "Ticket created successfully", ticket_id: response }, { status: 200, headers: ACTIONS_CORS_HEADERS })
        } else {
            const error: ActionError = {
                message: `Failed to create ticket`,
            }
            return Response.json(error, { status: 500, headers: ACTIONS_CORS_HEADERS })
        }

    } catch (e: any) {
        const error: ActionError = {
            message: `${e.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
