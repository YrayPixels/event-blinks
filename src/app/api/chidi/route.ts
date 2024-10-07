import { ACTIONS_CORS_HEADERS, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';


export const GET = (req: Request) => {
    try {
        const url = new URL(req.url);
        const payload = {
            icon: `http://localhost:3000/no-image.png`,
            title: "Sample title",
            description: "Create and manage your events and events Items directly from blinks, get access to the number of those that have purchased your tickets and registered for your events directly from your blinks.",
            label: `Create Event`,

            links: {
                actions: [
                    {
                        href: `/api/events/create`,
                        label: 'Tip me',
                        "parameters": [
                            {
                                name: "amount",
                                label: 'Enter any amount to tip', // text input placeholder
                                type: "number",
                            }
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
    const storyID = params.get('storyId'); //question id

    try {

        const body: ActionPostRequest = await req.json();

        /**
         * Fetch the user data.
         * Call your back end.
         * user Wallet Address
         */
        /**
         * body.account == User Wallet Address
         * body.data  == fields  amount
         * 
         */

        let writerAddress = "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ";

        let data: any = body?.data;
        let amount: any = data.amount;
        let userAddress = body?.account;
        //


        let address = process.env.WALLET_ADDRESS || "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ";

        let walletAddress = new PublicKey(address);
        const lamportsToSend = Number(amount) * LAMPORTS_PER_SOL;

        const transferTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(body.account),
                toPubkey: new PublicKey(writerAddress),
                lamports: lamportsToSend,
            }),
        );

        const connection = new Connection(clusterApiUrl("devnet"));
        transferTransaction.feePayer = new PublicKey(body.account);
        transferTransaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;



        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                type: "transaction",
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
