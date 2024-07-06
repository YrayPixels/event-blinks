import Image from "next/image";

let mockNFTs = [

  {
    title: "NFT 1",
    description: "This is the first NFT",
    image: "/nft.avif",
    price: 1
  },
  {
    title: "NFT 2",
    description: "This is the second NFT",
    image: "/nft.avif",
    price: 2
  },
  {
    title: "NFT 3",
    description: "This is the third NFT",
    image: "/nft.avif",
    price: 3

  },
  {
    title: "NFT 1",
    description: "This is the first NFT",
    image: "/nft.avif",
    price: 1
  },
  {
    title: "NFT 2",
    description: "This is the second NFT",
    image: "/nft.avif",
    price: 2
  },
  {
    title: "NFT 3",
    description: "This is the third NFT",
    image: "/nft.avif",
    price: 3

  }
]
export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center ">

      <h2 className="font-bold text-[40px] mb-10">Mint & Sell Your NFT's in one click with Blink</h2>

      <div className="w-10/12 m-auto grid grid-cols-4 gap-4 items-center">
        {
          mockNFTs.map((item, index) => {
            return (
              <div className="space-y-4 p-3 backdrop-blur-sm bg-[#1c1326] rounded-xl">
                <div className="rounded-xl overflow-hidden ">
                  <Image src={item.image} alt={item.title} style={{ objectFit: "cover" }} height={200} width={500} />
                </div>
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div className="text-[16px]" >{item.description}</div>
                </div>

                <div className="flex flex-row justify-between">
                  <div>
                    <div className="text-white text-[16px]">Price</div>
                    <div className="text-[#59E4C0] font-bold text-[16px]">{item.price} SOL</div>
                  </div>
                  <div>
                    <div className="text-white text-[16px]">Items</div>
                    <div className="text-[#59E4C0] font-bold text-[16px]">156.6k</div>
                  </div>
                  <div>
                    <div className="text-white text-[16px]">Minted</div>
                    <div className="text-[#59E4C0] font-bold text-[16px]">4</div>
                  </div>

                </div>
                <div className="justify-center items-center flex flex-row ">
                  <a href="/nft" className="rounded-xl bg-[#59E4C0] text-[#03634A] p-2 text-[16px] text-center w-full m-auto">Mint NFT's</a>
                </div>
              </div>
            )
          })
        }
      </div>

    </div>
  );
}
