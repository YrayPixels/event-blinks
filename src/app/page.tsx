"use client";
import Image from "next/image";
import { useState } from "react";


export default function Home() {



  const [actions, setActions] = useState([])

  const UploadBlink = async () => {

    fetch
  }

  return (
    <div className="flex flex-col justify-start items-center py-10 ">

      <h2 className="font-bold text-[40px] mb-10">Create Blinks With a Click</h2>

      <div className="w-10/12 md:w-5/12 m-auto  gap-y-2 items-center">

        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">Kinldy Select from the list of actions</label>
          <select name="" id="" className="p-2 rounded-lg bg-white/20">
            <option value="Receive">Receive/Donate</option>
          </select>
        </div>
        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">What's your Blink Title</label>
          <input type="text" className="p-2 rounded-lg bg-white/20" placeholder="enter name of your blink, it can be your name" />
        </div>

        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">What does your Blink Do!</label>
          <textarea className="p-2 rounded-lg bg-white/20" placeholder="describe your blink for users"></textarea>
        </div>

        <div className="mb-3 flex flex-col">
          <label htmlFor="" className="mb-1 ps-2">Blink Image</label>
          <input type="file" className="p-2 rounded-lg bg-white/20" />
        </div>

        <div>
          <button onClick={() => { }} className="rounded-xl bg-[#59E4C0] py-5 text-[#03634A] p-2 text-[16px] text-center w-full m-auto">Add Action</button>
        </div>

        {actions.map((action, index) => {
          return (
            <>
              <div className="mb-3 flex flex-col">
                <>
                </>
              </div>
            </>
          )
        })}
      </div>

    </div>
  );
}
