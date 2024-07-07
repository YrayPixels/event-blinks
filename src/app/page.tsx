"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import pako from 'pako';


export default function Home() {
  const [actionCarried, setActionCarried] = useState('ReceiveSol')
  const [tokenSelected, setTokenSelected] = useState({
    address: '',
    symbol: ''
  });
  const [tokens, setTokens] = useState<any>([])
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

    if (actions.title == '' || actions.description == '' || actions.image == '' || actions.price == '' || actions.actionTitle == '' || actions.walletAddress == '') {
      alert('All Fields are required')
      return
    }
    // let actionLinkJson = {
    //   link: 'https://create-actions.vercel.app/api/actions/mint',
    //   walletAddress: actions.walletAddress,
    //   price: actions.price,
    // }

    let blinkJson = {
      "title": actions.title,
      "description": actions.description,
      "image": actions.image,
      "price": actions.price,
      "actionTitle": `${actions.actionTitle} ${actions.price} ${actionCarried == "ReceiveOtherTokens" ? tokenSelected.symbol : 'SOL'}`,
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


  useEffect(() => {

    (async () => {
      fetch('https://token.jup.ag/strict').then(response => response.json()
      ).then(data => {
        setTokens(data)
        console.log(data)
      }).catch(err => console.log(err))
    })()
  }, [actionCarried])

  return (
    <div className="flex flex-col justify-start items-center py-10 ">
      <div className="h-[100px] w-[100px] rounded-full overflow-hidden">

        <Image src="/quick.jpg" style={{ objectFit: 'cover' }} width={200} height={200} alt="logo" />
      </div>

      <h2 className="font-bold text-[40px] mb-3 w-10/12 text-center">Create Blinks With a Click</h2>
      <a href="https://forms.gle/AkJSFZ94LguHqhc56" target="_blank" className="text-center mb-10 underline w-10/12">You want us to create a new action?. Let us Know</a>

      <div className="w-10/12 md:w-5/12 m-auto md:grid grid-cols-2  gap-x-2 justify-center gap-y-2 items-center">

        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">Kinldy Select from the list of actions</label>
          <select onChange={(e) => { setActionCarried(e.target.value) }} name="" id="" className="p-2 rounded-lg bg-white/20">
            <option value="ReceiveSol">Create Payment Link SOL</option>
            <option value="ReceiveOtherTokens">Create Payment Link Other Tokens</option>
          </select>
        </div>
        {actionCarried == 'ReceiveOtherTokens' &&
          <div className="mb-3 flex flex-col">
            <label htmlFor="" className="mb-1 ps-2">Kinldy Select Token </label>
            <select onChange={(e) => { setTokenSelected({ address: e.target.value.split(',')[0], symbol: e.target.value.split(',')[1] }) }} name="" id="" className="p-2 rounded-lg bg-white/20">
              {tokens.map((token: any, index: number) => {
                return <option key={index} value={[token.address, token.symbol]}>{token.symbol}</option>
              })}
            </select>
          </div>
        }
        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">What's your Blink Title</label>
          <input onChange={(e) => setActions({ ...actions, title: e.target.value })} type="text" className="p-2 rounded-lg bg-white/20" placeholder="enter name of your blink, it can be your name" />
        </div>

        <div className="mb-3 flex flex-col col-span-2">
          <label htmlFor="" className="mb-1 ps-2">What does your Blink Do!</label>
          <textarea rows={10} onChange={(e) => setActions({ ...actions, description: e.target.value })} className="p-2 rounded-lg bg-white/20" placeholder="describe your blink for users"></textarea>
        </div>

        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">Blink Image</label>
          <input onChange={(e) => setActions({ ...actions, image: e.target.value })} type="text" placeholder="put in your blink hosted image" className="p-2 rounded-lg bg-white/20" />
        </div>
        <div className="mb-5 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">Amount</label>
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
        <div className="col-span-2 ">
          <button onClick={() => UploadBlink()} className="rounded-xl  bg-[#59E4C0] py-5 text-[#03634A] p-2 text-[16px] text-center w-full m-auto">Create Action</button>
        </div>

        {
          blinkLink !== '' &&
          <div className="mt-5 w-full col-span-2 justify-center items-center flex flex-row">
            <a href={blinkLink} className="rounded-xl bg-yellow-400 py-5 text-[#03634A] p-2 text-[16px] text-center w-full m-auto" target="_blank">Click to Visit Blink Link</a>
          </div>
        }
      </div>

    </div>
  );
}
