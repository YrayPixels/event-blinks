import { compressUrl } from '@/app/utils/utils';
import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { NextApiRequest } from 'next';
import pako from 'pako';


export const GET = (req: Request) => {
    try {
        const url = new URL(req.url);
        const params = new URLSearchParams(url.search);

        let productTitle = params.get('title');
        let productDescription = params.get('description');
        let productImage = params.get('image');
        let productPrice = params.get('price');
        let token = params.get('token');
        let walletAddress = params.get('wallet');

        let missingFields = [];

        if (!productTitle) missingFields.push("title");
        if (!productDescription) missingFields.push("description");
        if (!productImage) missingFields.push("image");
        if (!productPrice) missingFields.push("price");
        if (!token) missingFields.push("token");
        if (!walletAddress) missingFields.push("walletAddress");

        if (missingFields.length > 0) {
            return Response.json({ message: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400, headers: ACTIONS_CORS_HEADERS });
        }


        let blinkJson = {
            "title": productTitle,
            "description": productDescription,
            "image": productImage,
            "price": productPrice,
            "actionTitle": `Purchase with ${productPrice} ${token}`,
            "actionUrl": "https://www.quick-blinks.xyz/api/actions/mint?send=" + encodeURIComponent(JSON.stringify({
                link: "https://www.quick-blinks.xyz/api/actions/mint",
                walletAddress: walletAddress,
                price: productPrice
            })),
            "walletAddress": walletAddress,
        }

        //to Json String
        const jsonString = JSON.stringify(blinkJson);
        //To Gzip
        const compressed = pako.gzip(jsonString);
        //To Base64
        const base64Encoded = Buffer.from(compressed).toString('base64');

        let item = JSON.stringify({ code: base64Encoded });


        let paymentLink = `https://www.dial.to/?action=solana-action:https://www.quick-blinks.xyz/api/actions/mint?create=${item}`;

        let response = {
            paymentLink: paymentLink,
            message: "Success"
        }

        return Response.json(response, { status: 200, headers: ACTIONS_CORS_HEADERS })


    } catch (error: any) {
        return new Response(JSON.stringify({ message: "Error parsing request", error: error?.response?.message }), {
            headers: ACTIONS_CORS_HEADERS,
            status: 500
        });
    }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {

    const body = await req.json();

    let productTitle = body.title;
    let productDescription = body.description;
    let productImage = body.image;
    let productPrice = body.price;
    let token = body.token;
    let walletAddress = body.walletAddress;

    let missingFields = [];

    if (!productTitle) missingFields.push("title");
    if (!productDescription) missingFields.push("description");
    if (!productImage) missingFields.push("image");
    if (!productPrice) missingFields.push("price");
    if (!token) missingFields.push("token");
    if (!walletAddress) missingFields.push("walletAddress");

    if (missingFields.length > 0) {
        return Response.json({ message: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }


    let blinkJson = {
        "title": productTitle,
        "description": productDescription,
        "image": productImage,
        "price": productPrice,
        "actionTitle": `Purchase with ${productPrice} ${token}}`,
        "actionUrl": "https://www.quick-blinks.xyz/api/actions/mint?send=" + encodeURIComponent(JSON.stringify({
            link: "https://www.quick-blinks.xyz/api/actions/mint",
            walletAddress: walletAddress,
            price: productPrice
        })),
        "walletAddress": walletAddress,
    }

    //to Json String
    const jsonString = JSON.stringify(blinkJson);
    //To Gzip
    const compressed = pako.gzip(jsonString);
    //To Base64
    const base64Encoded = Buffer.from(compressed).toString('base64');

    let item = JSON.stringify({ code: base64Encoded });


    let paymentLink = `https://www.dial.to/?action=solana-action:https://www.quick-blinks.xyz/api/actions/mint?create=${item}`;

    let response = {
        paymentLink: paymentLink,
        message: "Success"
    }

    return Response.json(response, { status: 200, headers: ACTIONS_CORS_HEADERS })

}
