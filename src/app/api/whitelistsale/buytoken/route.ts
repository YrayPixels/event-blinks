import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { NextApiRequest } from 'next';
import pako from 'pako';

import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import { IDL, WhitelistGatedSale } from '@/app/utils/whitelist_gated_sale';


const programId = new web3.PublicKey("CRKtvQJeuqgASZzoSFnRh65ihHRVyMzidrw7sQmfYKi7");
const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

const wallet = web3.Keypair.fromSecretKey(Uint8Array.from(
    [176, 123, 152, 19, 180, 144, 11, 38, 110, 16, 140, 146, 127, 156, 193, 155, 23, 240, 182, 62, 34, 221, 218, 82, 32, 91, 92, 214, 27, 228, 35, 177, 225, 62, 220, 199, 24, 31, 94, 49, 33, 103, 237, 97, 111, 236, 91, 99, 130, 93, 123, 242, 194, 225, 113, 140, 251, 246, 136, 232, 205, 200, 219, 29]
));


const anchorProvider = new anchor.AnchorProvider(connection, new anchor.Wallet(wallet), {});
const program = new anchor.Program(IDL as WhitelistGatedSale, programId, anchorProvider);


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
                                "name": "walletaddress", // field name
                                "label": "enter wallet address to check whitelist status" // text input placeholder
                            }
                        ]
                    },
                    {
                        href: 'https://www.quick-blinks.xyz/api/whitelistsale/buytoken',
                        label: 'Buy',
                        parameters: [
                            {
                                "name": "amount", // field name
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



        const buyTokenInstruction = program.methods
            .buyToken(new anchor.BN(1))
            .accounts({
                state: statePda,
                userInfo: userInfoPda,
                buyer: buyer.publicKey,
                treasury: treasury.publicKey,
                mint: mint.publicKey,
                tokenAccount: tokenAccount.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                tokenAuthority: tokenAuthority.publicKey,
                systemProgram: web3.SystemProgram.programId,
            })
            .instruction();

        const body: ActionPostRequest = await req.json();


        const transferTransaction = new web3.Transaction()

        transferTransaction.add(buyTokenInstruction);

        const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
        transferTransaction.feePayer = new web3.PublicKey(body.account);
        transferTransaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction: txHass,

            },

        })

        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })

    } catch (e) {
        return Response.json({ message: "Error sending transaction" }, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
