import { NETWORK, createEvent } from '@/app/utils/requestsHandler';
import { ACTIONS_CORS_HEADERS, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { constant } from 'lodash';


export const GET = (req: Request) => {
    try {
        const url = new URL(req.url);

        //work on timing here.

        //last time + new time = main time


        const payload = {
            icon: `${process.env.NEXT_PUBLIC_HOST_URL}/dscvr.png`,
            title: "Daily DSCVR Quiz",
            description: `Question: What are the basic primitives that DSCVR is built around?`,
            links: {
                actions: [
                    {
                        href: `/api/dscvr-quiz`,
                        label: 'Submit Answer',
                        parameters: [
                            // {
                            //     name: "flyer_url",
                            //     label: 'enter the link to the flyer for your event - leave empty if none', // text input placeholder
                            //     type: "url",
                            // },
                            {
                                name: "answer",
                                label: 'Choose from the options below', // text input placeholder
                                type: "radio",
                                options: [

                                    {
                                        value: "content-posts-rewards",
                                        label: "Content - Posts - Rewards",
                                    },
                                    {
                                        value: "profile-posts-rewards",
                                        label: "Profile - Posts - Rewards",
                                    },
                                    {
                                        value: "profiles-portals-content",
                                        label: "Profiles - Portals - Content",
                                    },
                                    {
                                        value: "contents-rewards",
                                        label: "Contents - Rewards",
                                    },
                                ]
                            },
                        ],

                    }
                ],
                // next: '/events/create',
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
    try {

        const body: ActionPostRequest = await req.json();

        let data: any = body?.data;


        let address = process.env.WALLET_ADDRESS || "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ";
        let walletAddress = new PublicKey(address);
        const lamportsToSend = Number(0.00001) * LAMPORTS_PER_SOL;
        const transferTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(body.account),
                toPubkey: walletAddress,
                lamports: lamportsToSend,
            }),
        ); 5

        const connection = new Connection(NETWORK);
        transferTransaction.feePayer = new PublicKey(body.account);
        transferTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        let payload: ActionPostResponse;

        if (data.answer === 'profiles-portals-content') {
            payload = await createPostResponse({
                fields: {
                    transaction: transferTransaction,
                    message: "Correct Answer",
                },
            })
        } else {
            payload = await createPostResponse({
                fields: {
                    transaction: transferTransaction,
                    message: "InCorrect Answer Try Again!!",
                },
            })
        }

        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })

    } catch (e: any) {
        const error: ActionError = {
            message: `${e.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
