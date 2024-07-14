import * as anchor from '@project-serum/anchor';
import * as web3 from "@solana/web3.js";
import { IDL, WhitelistGatedSale } from '@/app/utils/whitelist_gated_sale';


import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { NextApiRequest } from 'next';
import pako from 'pako';

const programId = new web3.PublicKey("CRKtvQJeuqgASZzoSFnRh65ihHRVyMzidrw7sQmfYKi7");
const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

const program = new anchor.Program(IDL as WhitelistGatedSale, programId, anchor.AnchorProvider.env());


export const GET = (req: Request) => {
    try {

        const payload = {
            icon: new URL('https://www.quick-blinks.xyz/_next/image?url=%2Fquick.jpg&w=256&q=75'),
            title: 'Buy QUICK BLINKS Token',
            description: 'Kindly Proceed with purchase if your wallet is whitelisted!. Maximum amount to purchase is 100QKB',
            label: `Purchase`,
            links: {
                actions: [
                    {
                        href: 'https://www.quick-blinks.xyz/api/whitelistsale/checkwhitelist',
                        label: 'Check',
                        parameters: [
                            {
                                "name": "Check if you're whitelisted", // field name
                                "label": "enter wallet address to check whitelist status" // text input placeholder
                            }
                        ]
                    },
                    {
                        href: 'https://www.quick-blinks.xyz/api/whitelistsale/buytoken',
                        label: 'Buy',
                        parameters: [
                            {
                                "name": "Amount to Purchase", // field name
                                "label": "kindly enter the amount to purchase" // text input placeholder
                            }
                        ]
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

        const statePda = new web3.PublicKey('GUEGCufNfnLXUDKA9np4cC5TSYviFvFpgY61DPw8GLDM')

        const newWhitelist = await program.account.state.fetch(statePda);
        console.log(newWhitelist);

        const tx = new web3.Transaction();
        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction: tx,
                message: "Transaction sent successfully"
            },

        })

        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })

    } catch (e) {
        return Response.json({ message: "Error sending transaction" }, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
