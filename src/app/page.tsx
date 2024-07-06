"use client";
import Image from "next/image";
import { useState } from "react";
import pako from 'pako';


export default function Home() {
  const [actions, setActions] = useState({
    title: '',
    description: '',
    image: '',
    price: '0',
    actionTitle: '',
    walletAddress: ''
  })


  const [blinkLink, setBlinkLink] = useState('')

  const UploadBlink = async () => {
    let actionLinkJson = {
      link: 'https://create-actions.vercel.app/api/actions/mint',
      walletAddress: actions.walletAddress,
      price: actions.price,
    }

    let blinkJson = {
      "title": actions.title,
      "description": actions.description,
      "image": actions.image,
      "price": actions.price,
      "actionTitle": `${actions.actionTitle} ${actions.price} SOL`,
      "actionUrl": "https://create-actions.vercel.app/api/actions/mint?send=" + encodeURIComponent(JSON.stringify({
        link: "https://create-actions.vercel.app/api/actions/mint",
        walletAddress: actions.walletAddress,
        price: actions.price
      })),
      "walletAddress": actions.walletAddress,
    }
    //to Json String
    const jsonString = JSON.stringify(blinkJson);
    //To Gzip
    const compressed = pako.gzip(jsonString);
    //To Base64
    const base64Encoded = Buffer.from(compressed).toString('base64');

    let item = JSON.stringify({ code: base64Encoded });

    // setBlinkLink(`https://www.dial.to/?action=solana-action:https://create-actions.vercel.app/api/actions/mint?create=${encodeURIComponent(JSON.stringify(blinkJson))}`)

    setBlinkLink(`https://www.dial.to/?action=solana-action:https://create-actions.vercel.app/api/actions/mint?create=${item}`)

  }

  return (
    <div className="flex flex-col justify-start items-center py-10 ">

      <h2 className="font-bold text-[40px] mb-10 w-10/12 text-center">Create Blinks With a Click</h2>

      <div className="w-10/12 md:w-5/12 m-auto  gap-y-2 items-center">

        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">Kinldy Select from the list of actions</label>
          <select name="" id="" className="p-2 rounded-lg bg-white/20">
            <option value="Receive">Receive/Donate</option>
          </select>
        </div>
        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">What's your Blink Title</label>
          <input onChange={(e) => setActions({ ...actions, title: e.target.value })} type="text" className="p-2 rounded-lg bg-white/20" placeholder="enter name of your blink, it can be your name" />
        </div>

        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">What does your Blink Do!</label>
          <textarea rows={10} onChange={(e) => setActions({ ...actions, description: e.target.value })} className="p-2 rounded-lg bg-white/20" placeholder="describe your blink for users"></textarea>
        </div>

        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">Blink Image</label>
          <input onChange={(e) => setActions({ ...actions, image: e.target.value })} type="text" placeholder="put in your blink hosted image" className="p-2 rounded-lg bg-white/20" />
        </div>
        <div className="mb-5 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">Amount to Receive/Donate</label>
          <input onChange={(e) => setActions({ ...actions, price: e.target.value })} type="number" className="p-2 rounded-lg bg-white/20" placeholder="Amount to Receive" />
        </div>
        <div className="mb-5 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">Enter Action Label</label>
          <input onChange={(e) => setActions({ ...actions, actionTitle: e.target.value })} type="text" className="p-2 rounded-lg bg-white/20" placeholder="Amount to Receive" />
        </div>

        <div className="mb-5 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">Enter Wallet Address</label>
          <input onChange={(e) => setActions({ ...actions, walletAddress: e.target.value })} type="text" className="p-2 rounded-lg bg-white/20" placeholder="Enter your wallet address" />
        </div>
        <div>
          <button onClick={() => UploadBlink()} className="rounded-xl bg-[#59E4C0] py-5 text-[#03634A] p-2 text-[16px] text-center w-full m-auto">Add Action</button>
        </div>

        {
          blinkLink !== '' &&
          <div className="mt-5 w-full justify-center items-center flex flex-row">
            <a href={blinkLink} className="rounded-xl bg-yellow-400 py-5 text-[#03634A] p-2 text-[16px] text-center w-full m-auto" target="_blank">Click to Visit Blink Link</a>
          </div>
        }
      </div>

    </div>
  );
}
