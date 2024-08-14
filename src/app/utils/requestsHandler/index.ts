import { clusterApiUrl } from "@solana/web3.js";
import { request } from "./request"


export const fetchEvent = async (eventId: string) => {
    let response = await request.get(`/get-event/${eventId}`)
    return response;
}

export const createEvent = async (
    eventName: string,
    description: string,
    date: string,
    location: string,
    flyer_uri: string,
    time: string,
    payment_method: string,
    payment_address: string,
    owner: string,
    fee: string,
) => {

    let bodyContent = new FormData();
    bodyContent.append("event_name", eventName);
    bodyContent.append("description", description);
    bodyContent.append("date", date);
    bodyContent.append("location", location);
    bodyContent.append("flyer_uri", flyer_uri);
    bodyContent.append("time", time);
    bodyContent.append("fee", fee)
    bodyContent.append("payment_method", payment_method);
    bodyContent.append("payment_address", payment_address);
    bodyContent.append("owner", owner);



    let response = await request.post({ url: '/create-event', data: bodyContent })
    return response;
}




export const NETWORK = process.env.NEXT_PUBLIC_NETWORK == 'devnet' ? clusterApiUrl('devnet') : clusterApiUrl('mainnet-beta');



