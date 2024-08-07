"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import pako from 'pako';
import { Close, Menu } from "@material-ui/icons";
import { TopNav } from "@/components/navigation/TopNav";


export default function Home() {
  const [menu, setMenu] = useState(false)

  return (
    <div>
      <TopNav />

      <div className="md:h-screen  md:overflow-hidden flex flex-col  relative justify-center items-center">
        <div className="flex flex-col top-[200px] relative leading-tight justify-center  items-center z-50">
          <h1 className="text-[70px] md:text-[70px] text-center text-flicker font-bold">Quick Blinks</h1>
          <p className="text-[24px] mb-5">No code? No Problem</p>

          <div className="flex flex-row justify-center items-center w-full gap-x-4">
            <a href="/quick-link" className="text-[15px] rounded-xl  md:w-[200px] text-center p-4 bg-[#60DEE8] hover:bg-[#ED3A4F] ">Create a Quick-Blink</a>
            <a href="/developers" className="text-[15px] rounded-xl  md:w-[200px] text-center p-4 bg-[#ED3A4F] hover:bg-[#60DEE8]">Developers</a>
          </div>

          <div className=" ">
            <Image src={'/create.png'} alt="" width={700} height={100} />
          </div>
        </div>



      </div>
      {menu &&
        <div className="flex  fixed top-0 h-screen w-screen bg-black gap-y-8  flex-col justify-start pt-10 items-center mt-5">
          <div>
            <div onClick={() => setMenu(false)}>
              <Close />
            </div>
          </div>
          <a className="font-bold " href="/developers">Developers</a>
          <a className="font-bold " href="/about-us">About Us</a>
          <a className="font-bold " href="/quick-link">Instant Links</a>
        </div>
      }

    </div>

  );
}
