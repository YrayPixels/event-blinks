"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import pako from 'pako';
import { Close, Menu } from "@material-ui/icons";


export default function ActionsDestructure() {
  const [menu, setMenu] = useState(false)

  return (
    <div>

      <div className="flex flex-row justify-between items-center fixed top-0 w-full px-[24px] py-5 ">
        <div className="flex fle-row items-center gap-x-2">
          <div className="h-[50px] w-[50px] rounded-full overflow-hidden">
            <Image src="/quick.jpg" style={{ objectFit: 'cover' }} width={200} height={200} alt="logo" />
          </div>
        </div>

        <div className="md:hidden" onClick={() => setMenu(true)}>
          <Menu />
        </div>
        <div className="hidden md:flex  gap-x-4 text-white flex-row justify-center items-center mt-5">
          <a className="font-bold text-white" href="/developers">Developers</a>
          <a className="font-bold text-white" href="/about-us">About Us</a>
          <a className="font-bold text-white" href="/quick-link">Instant Links</a>
        </div>
      </div>

      <div className="h-screen flex flex-col justify-center items-center">

        <h1 className="text-[100px] md:text-[150px] text-center text-flicker font-bold">Quick Blinks</h1>
        <div className="flex flex-row justify-center items-center w-full gap-x-4">
          <a href="/quick-link" className="text-[15px] rounded-xl  md:w-[200px] text-center p-4 bg-[#60DEE8] hover:bg-[#ED3A4F] ">Create a Quick-Blink</a>
          <a href="/developers" className="text-[15px] rounded-xl  md:w-[200px] text-center p-4 bg-[#ED3A4F] hover:bg-[#60DEE8]">Developers</a>
        </div>

      </div>
      {menu &&
        <div className="flex  fixed top-0 h-screen w-screen bg-black gap-y-8 text-white flex-col justify-start pt-10 items-center mt-5">
          <div>
            <div onClick={() => setMenu(false)}>
              <Close />
            </div>
          </div>
          <a className="font-bold text-white" href="/developers">Developers</a>
          <a className="font-bold text-white" href="/about-us">About Us</a>
          <a className="font-bold text-white" href="/quick-link">Instant Links</a>
        </div>
      }

    </div>

  );
}
