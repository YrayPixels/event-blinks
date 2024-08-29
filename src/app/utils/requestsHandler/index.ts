import { clusterApiUrl } from "@solana/web3.js";
import { request } from "./request"


export const fetchEvent = async (eventId: string) => {
    let response = await request.get(`/get-event/${eventId}`)
    return response;
}

export const fetchNullEvents = async () => {
    let response = await request.get(`/get-null-events`);
    return response;
}

export const updateEventTransaction = async (eventId: string, transaction_hash: string) => {
    let bodyContent = new FormData();
    bodyContent.append("event_id", eventId);
    bodyContent.append("transaction_hash", transaction_hash);

    let response = await request.post({ url: '/update-event-transactions', data: bodyContent })
    return response;
}

export const getAllEvent = async () => {
    let response = await request.get(`/get-all-events`)
    return response;
}

export const getAllRegistrations = async () => {
    let response = await request.get(`/get-all-registrations`)
    return response;
}

export const confirmEventPayment = async (id: string) => {
    let response = await request.get(`/confirm-event-payment`)
    return response;
}


export const confirmRegPayment = async (id: string) => {
    let response = await request.get(`/confirm-reg-payment/${id}`)
    return response;
}


export const fetchTickets = async (eventId: string) => {
    let response = await request.get(`/get-tickets-for-event/${eventId}`)
    return response;
}

export const createEvent = async (
    eventName: string,
    description: string,
    date: string,
    location: string,
    flyerUri: string,
    time: string,
    paymentMethod: string,
    paymentAddress: string,
    owner: string,
    fee: string,
    email: string
) => {

    let bodyContent = new FormData();
    bodyContent.append("event_name", eventName);
    bodyContent.append("description", description);
    bodyContent.append("date", date);
    bodyContent.append("location", location);
    bodyContent.append("flyer_uri", flyerUri);
    bodyContent.append("time", time);
    bodyContent.append("fee", fee)
    bodyContent.append("payment_method", paymentMethod);
    bodyContent.append("payment_address", paymentAddress);
    bodyContent.append("owner", owner);
    bodyContent.append("email_address", email);



    let response = await request.post({ url: '/create-event', data: bodyContent })
    return response;
}


export const createEventTicket = async (
    eventId: string,
    ticketName: string,
    price: string,
    image: string,
    quantity: string,
) => {
    let bodyContent = new FormData();
    bodyContent.append("event_id", eventId);
    bodyContent.append("ticket_name", ticketName);
    bodyContent.append("price", price);
    bodyContent.append("ticket_image", image);
    bodyContent.append("quantity", quantity);
    let response = await request.post({ url: '/create-ticket', data: bodyContent })
    return response;
}




// export const NETWORK = process.env.NEXT_PUBLIC_NETWORK == 'devnet' ? clusterApiUrl('devnet') : clusterApiUrl('mainnet-beta');



export const NETWORK = process.env.NEXT_PUBLIC_NETWORK == 'devnet' ? `https://devnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS}` : `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS}`;