import { NETWORK, createEvent } from '@/app/utils/requestsHandler';
import { ACTIONS_CORS_HEADERS, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
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
                            {
                                name: "name",
                                label: 'please enter your name: pseudo names are allowed', // text input placeholder
                                type: "text",
                            },
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



        let payload: ActionPostResponse;

        if (data.answer === 'profiles-portals-content') {

            let address = process.env.WALLET_ADDRESS || "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ";
            let walletAddress = new PublicKey(address);
            const lamportsToSend = Number(0.00001) * LAMPORTS_PER_SOL;
            const transferTransaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(body.account),
                    toPubkey: walletAddress,
                    lamports: lamportsToSend,
                }),
            );

            let bonkMint = new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');

            const senderTokenAddress = await getAssociatedTokenAddress(bonkMint, walletAddress);
            const receiverTokenAddress = await getAssociatedTokenAddress(bonkMint, new PublicKey(body.account));
            let amount = 1000 * Math.pow(10, 5)
            const transferInstruction = createTransferInstruction(
                senderTokenAddress,
                receiverTokenAddress,
                walletAddress,
                amount,
            );

            transferTransaction.add(transferInstruction);

            const connection = new Connection(NETWORK);
            transferTransaction.feePayer = new PublicKey(body.account);
            transferTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            payload = await createPostResponse({
                fields: {
                    transaction: transferTransaction,
                    message: "Correct Answer Horray!!",
                },
            })
        } else {

            const error: ActionError = {
                message: "InCorrect Answer Try Again!!",
            }
            return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
            // payload = await createPostResponse({
            //     fields: {
            //         transaction: transferTransaction,
            //         message: "InCorrect Answer Try Again!!",
            //     },
            // })
        }

        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })

    } catch (e: any) {
        const error: ActionError = {
            message: `${e.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
