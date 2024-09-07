"use client";
import { useEffect, useState } from "react";
import AppWalletProvider from "@/components/walletAdapter/AppWalletProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import CustomInput from "@/components/customInput/customInput";
import { Button } from "@mui/material";
import { Connection, Keypair, PublicKey, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";
import { AuthorityType, TOKEN_PROGRAM_ID, createSetAuthorityInstruction, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { IDL, Nectarfi } from "./idl";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";


function Home() {

  let connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
  const { wallet, publicKey, signTransaction, sendTransaction } = useWallet();
  const [publicKeyUser, setPublicKey] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [notify, setNotify] = useState('');
  const [trans, setTxn] = useState('3Nh4XyCUqFaNK864yK3KSQeQZjJSRHg5ZAHJfCtzyuoqFDFSptcF4dfTcu9jB6rj5WqepeRKjqRFs4TuS36FF5FY');
  const anchorwallet = useAnchorWallet()

  useEffect(() => {
    if (publicKey) {
      setPublicKey(publicKey);
    }
  }, [publicKey])


  console.log(publicKeyUser)

  const swapTokens = async () => {
    if (!publicKeyUser) return;
    if (!anchorwallet) return;
    const anchorProvider = new AnchorProvider(connection, anchorwallet, {});
    if (!anchorProvider) {
      return;
    }
    const programId = new PublicKey("GdgasCAknqTXGqThZRDQ2pQx6uejAsRbDKrxijCNEGp3");
    const program = new Program<Nectarfi>(IDL, programId, anchorProvider);

    //
    const NCTRMINT = new PublicKey(
      "2pJmbt3j2QJ4pKhxbrEBuPsdd76pHh8S5DbfokTRwxFr"
    );


    const private_key = [97, 102, 178, 203, 115, 110, 80, 172, 101, 217, 52, 47, 97, 39, 192, 157, 171, 198, 216, 231, 88, 160, 76, 172, 85, 96, 94, 196, 148, 238, 213, 237, 183, 28, 14, 166, 212, 158, 43, 140, 105, 244, 199, 144, 105, 22, 142, 14, 36, 132, 243, 112, 236, 203, 201, 11, 101, 67, 102, 52, 3, 166, 68, 79]


    const MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
    const VAULT = new PublicKey("2rLwbBbbWRhf7FwSssHPzJkeZUjuu7D2xjJMpy6Nr8FP");

    let arr = Uint8Array.from(private_key.splice(0, 32));
    const signer = Keypair.fromSeed(arr);



    let userAta = await getOrCreateAssociatedTokenAccount(
      connection,
      signer,
      MINT,
      publicKeyUser
    );
    let vaultAta = await getOrCreateAssociatedTokenAccount(
      connection,
      signer,
      MINT,
      VAULT
    );
    let userNAta = await getOrCreateAssociatedTokenAccount(
      connection,
      signer,
      NCTRMINT,
      publicKeyUser
    );


    const txn = await program.methods.deposit(new BN(Number(amount))).accounts({
      nectarfiState: new PublicKey(
        "2WF4LAe31tTkyCxXQ76M2cGxjRqy8nPatG2AwUnN1PgN"
      ),
      user: publicKeyUser,
      userTokenAccount: new PublicKey(userAta.address),
      vaultTokenAccount: new PublicKey(vaultAta.address),
      depositTokenMint: MINT,
      nectarMint: NCTRMINT,
      userNectarAccount: new PublicKey(userNAta.address),
      tokenProgram: TOKEN_PROGRAM_ID,
    }).rpc()

    if (txn) {
      setTxn(txn)
      setNotify('Swap Done Successfully')
    }
    // const fetchItems = async () => {
    //   let listitems = await program.account.listing.all();
    //   setNftItems(listitems);

  }

  const updateSetAuthority = async () => {

    let mint = new PublicKey('2pJmbt3j2QJ4pKhxbrEBuPsdd76pHh8S5DbfokTRwxFr');
    let owner = new PublicKey('7onFqyJuCtSzSARS4C1gMpitvdSVyowpCuEdSgVvZH97');
    let newAuthority = new PublicKey('2WF4LAe31tTkyCxXQ76M2cGxjRqy8nPatG2AwUnN1PgN');

    let transaction = new Transaction()
      .add(createSetAuthorityInstruction(
        mint,
        owner,
        AuthorityType.MintTokens,
        newAuthority
      ));

    transaction.feePayer = owner;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    if (signTransaction) {
      let tx = await signTransaction(transaction);

      let sent = await sendTransaction(transaction, connection);
      console.log(tx);
      console.log(sent);

    }
  }

  return (
    <div className="h-screen w-screen flex flex-row justify-center items-center">
      <div>

        <div className="mb-3">
          <WalletMultiButton />
        </div>

        <div>
          <p className="w-6/12 mb-3">{notify.length > 0 &&
            <>
              {notify + "  "}
              <a target="_blank" className="underline" href={`https://explorer.solana.com/tx/${trans}?cluster=devnet`}>{trans.slice(0, 5) + "..." + trans.slice(80)}</a>
            </>
          }
          </p>
        </div>
        <div className="border p-10 rounded-xl">

          <CustomInput
            type="number"
            placeholder="enter amount of tokens to deposit"
            label="Deposit amount"
            value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            className="w-full mt-5"
            endIcon={<i className="fas fa-plus-circle" />}
            onClick={() => swapTokens()}
          >Deposit</Button>

          {/* <Button
            variant="contained"
            color="primary"
            size="large"
            className="w-full mt-5"
            endIcon={<i className="fas fa-plus-circle" />}
            onClick={() => updateSetAuthority()}
          >Mint Test</Button> */}
        </div>



      </div>

    </div>
  );
}


export default function Minter() {
  return (
    <AppWalletProvider>
      <Home />
    </AppWalletProvider>
  )
}