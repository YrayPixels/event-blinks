import { NETWORK, createEvent } from '@/app/utils/requestsHandler';
import { createNewsletter } from '@/app/utils/requestsHandler/newsletter';
import { ACTIONS_CORS_HEADERS, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, clusterApiUrl } from '@solana/web3.js';


export const GET = (req: Request) => {
    try {
        const url = new URL(req.url);
        const payload = {
            icon: `${process.env.NEXT_PUBLIC_HOST_URL}/mailinglist.jpg`,
            title: "Collect Emails for Your Newsletter with Quick Blinks",
            description: "Our tool helps you collect your mailing list by creating a blink you can share with your users to subscribe.",
            links: {
                actions: [
                    {
                        href: `/api/newsletter/create`,
                        label: 'Create Mailing List',
                        "parameters": [
                            {
                                "name": "email_address", // field name
                                "label": "enter your email address", // text input placeholder
                                type: "email",
                                required: true,
                            },
                            {
                                "name": "full_name", // field name
                                "label": "enter your full name", // text input placeholder
                                type: "text",
                                required: true,
                            },
                            {
                                name: "purpose", //
                                label: 'Purpose of newsletter/mailing list', // text input placeholder,
                                type: "textarea",
                                required: true,
                            },
                            {
                                name: "img_url", //
                                label: 'Add link to img that will be displayed for users', // text input placeholder,
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

    try {

        const body: ActionPostRequest = await req.json();

        let data: any = body?.data;

        let address = process.env.WALLET_ADDRESS || "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ";
        let walletAddress = new PublicKey(address);
        const lamportsToSend = Number(0.0005) * LAMPORTS_PER_SOL;

        const tx = new Transaction()
        // SystemProgram.transfer({
        //     fromPubkey: new PublicKey(body.account),
        //     toPubkey: walletAddress,
        //     lamports: lamportsToSend,
        // }),

        let message = "Signing this transaction means you are creating a newsletter blinks through quick blinks";

        await tx.add(
            new TransactionInstruction({
                keys: [{ pubkey: new PublicKey(body.account), isSigner: true, isWritable: true }],
                data: Buffer.from(message, "utf-8"),
                programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
            }))
        const connection = new Connection(NETWORK);
        tx.feePayer = new PublicKey(body.account);
        tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

        try {
            const response = await createNewsletter(
                data?.email_address,
                data?.full_name,
                data?.purpose,
                data?.img_url,
            );
            console.log(response);

        } catch (eventError: any) {
            console.error('Error in Creating Newsletter:', eventError);
            const error: ActionError = {
                message: `${eventError.message}`,
            }
            return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
        }
        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction: tx,
                message: "Newsletter Created Successfully, Kindly check your mail for more information",
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
