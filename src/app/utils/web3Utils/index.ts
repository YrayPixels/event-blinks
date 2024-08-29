import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
    createAssociatedTokenAccountInstruction, getAssociatedTokenAddress,
    NATIVE_MINT,
    createTransferInstruction,
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import { NETWORK } from "../requestsHandler";

const QRCode = require('qrcode');







export const TransferUsdc = async (
    network: any,
    senderAccount: PublicKey,    // Keypair of the sender
    recipientPubkey: PublicKey,  // PublicKey of the recipient
    amount: any,
) => {

    // Establish connection
    const connection = new Connection(network);

    // USDC Mint Address on Solana
    const usdcMintAddress = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

    //get senders ata


    const amountInSmallestUnit = BigInt(amount * 1_000_000)
    // Get the sender's associated token account for USDC
    const senderTokenAccount = await getAssociatedTokenAddress(
        usdcMintAddress,
        senderAccount,
    );

    const recipientTokenAccount = await getAssociatedTokenAddress(
        usdcMintAddress,
        recipientPubkey,
    )

    const transaction = new Transaction()
        .add(
            createAssociatedTokenAccountInstruction(
                senderAccount,
                recipientTokenAccount,
                recipientPubkey,
                usdcMintAddress
            )
        );

    const transferInstruction = createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        senderAccount,
        amountInSmallestUnit,
        [],
        TOKEN_PROGRAM_ID
    );


    transaction.add(transferInstruction);

    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.feePayer = senderAccount;


    return transaction;

}
export const TransferSol = async (
    network: any,
    senderAccount: PublicKey,    // Keypair of the sender
    recipientPubkey: PublicKey,  // PublicKey of the recipient
    amount: any,
) => {

    const connection = new Connection(network);
    const lamportsToSend = amount * LAMPORTS_PER_SOL;
    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: senderAccount,
            toPubkey: recipientPubkey,
            lamports: lamportsToSend,
        }),
    );
    transferTransaction.feePayer = senderAccount;
    transferTransaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    return transferTransaction;
}


// // Function to mint NFT
// export async function mintNFT(wallet: Keypair, qrCodeImagePath: string, ticketInfo: string) {
//     const connection = new Connection(NETWORK, 'confirmed');
//     const metaplex = Metaplex.make(connection)
//         .use(keypairIdentity(wallet))
//         .use(bundlrStorage());

//     const { uri } = await metaplex
//         .nfts()
//         .uploadMetadata({
//             name: 'Event Ticket',
//             symbol: 'TICKET',
//             description: 'Ticket for Event',
//             image: qrCodeImagePath, // Path to QR code image
//             attributes: [{ trait_type: 'Ticket ID', value: ticketInfo }],
//         });

//     const { nft } = await metaplex
//         .nfts()
//         .create({
//             uri,
//             name: 'Event Ticket',
//             sellerFeeBasisPoints: 500, // 5% royalty
//             maxSupply: 1,
//         });

//     console.log('NFT minted:', nft);
//     return nft;
// }


// export async function handleTicketPurchase(wallet: Keypair, ticketId: string, userInfo: string) {
//     try {
//         // Generate QR Code
//         const qrCodePath = await generateQRCode(ticketId);
//         // Mint the NFT with the QR code and user information
//         const nft = await mintNFT(wallet, qrCodePath, userInfo);
//         console.log('NFT successfully minted:', nft);
//     } catch (err) {
//         console.error('Error in minting NFT:', err);
//     }
// }
// // Function to generate QR code image
// async function generateQRCode(ticketId: string) {
//     try {
//         const qrCodeData = await QRCode.toDataURL(ticketId);
//         const base64Data = qrCodeData.replace(/^data:image\/png;base64,/, "");
//         fs.writeFileSync("ticket_qr_code.png", base64Data, 'base64');
//         console.log("QR code image generated successfully.");
//         return "ticket_qr_code.png";
//     } catch (err) {
//         console.error("Error generating QR code", err);
//         throw err;
//     }
// }

export const ValidateTransfer = async (
    amount: number,
    paymentMethod: string,
    fromWalletAddress: string,
    toWalletAddress: string
) => {
    try {
        // Network connection, can be replaced with an env variable
        const connection = new Connection(NETWORK, 'confirmed');

        // Validate input addresses
        if (!toWalletAddress || !fromWalletAddress) {
            return {
                status: false,
                message: "Wallet addresses cannot be null"
            };
        }

        let toAddress: PublicKey;
        let fromAddress: PublicKey;

        try {
            toAddress = new PublicKey(toWalletAddress);
            fromAddress = new PublicKey(fromWalletAddress);
        } catch (e) {
            return { status: false, message: 'Invalid Wallet Address' };
        }

        // Get recent transaction signatures
        // const confirmedSignatureInfos = await connection.getConfirmedSignaturesForAddress2(toAddress, { limit: 10 });
        const confirmedSignatureInfos = await connection.getSignaturesForAddress(toAddress, { limit: 10 });


        // Iterate through the signatures and find the matching transaction
        let transactionFound = false;
        for (let sigInfo of confirmedSignatureInfos) {
            // const transaction = await connection.getParsedConfirmedTransaction(sigInfo.signature);
            const transaction = await connection.getParsedTransaction(sigInfo.signature, {
                'maxSupportedTransactionVersion': 0
            });
            if (transaction) {
                const instructions = transaction.transaction.message.instructions;
                for (let instruction of instructions) {

                    if ('parsed' in instruction) {

                        if (paymentMethod === 'SOL') {
                            if (instruction.programId.equals(SystemProgram.programId) &&
                                instruction.parsed.info.destination == toAddress &&
                                instruction.parsed.info.source == fromAddress) {
                                let lamp_Val = instruction.parsed.info.lamports;
                                let convertedAmt = Number(lamp_Val) / LAMPORTS_PER_SOL;
                                if (convertedAmt === amount) {
                                    transactionFound = true;
                                    return {
                                        status: true,
                                        message: 'Transfer found',
                                        transactionHash: sigInfo.signature,
                                        details: transaction
                                    };
                                }
                            }
                        } else {
                            // For SPL tokens like USDC
                            if (instruction.programId.equals(TOKEN_PROGRAM_ID) &&
                                instruction.parsed.info.tokenAddress == new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') &&
                                instruction.parsed.info.destination == toAddress &&
                                instruction.parsed.info.source === fromAddress) {
                                let tokenAmount = instruction.parsed.info.tokenAmount.uiAmount;
                                if (tokenAmount === amount) {
                                    transactionFound = true;
                                    return {
                                        status: true,
                                        message: 'Transfer found',
                                        transactionHash: sigInfo.signature,
                                        details: transaction
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!transactionFound) {
            return { status: false, message: 'No Transaction Found', };
        }

    } catch (error) {
        console.error(error);
        return { status: false, message: 'An Error Occurred', error };
    }
}