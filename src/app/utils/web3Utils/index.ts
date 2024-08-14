import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
    createAssociatedTokenAccountInstruction, getAssociatedTokenAddress,
    NATIVE_MINT,
    createTransferInstruction,
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

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