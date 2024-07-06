import Image from "next/image";

export const mockNFTs = [

    {
        title: "NFT 1",
        description: "INX will be the newest addition to the Quirkies ecosystem, a cutting edge Streetwear and Entertainment brand born on Ethereum.",
        image: "/nft.avif",
        price: 0.001
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
    let item = mockNFTs[0];
    return (
        <div className="flex flex-col justify-start items-center ">


            <div className="w-10/12 m-auto gap-4 items-center bg-white/10 rounded-2xl p-3">

                <div className="space-y-3 p-3 grid grid-cols-2 backdrop-blur-sm bg-[#1c1326] rounded-xl">
                    <div className="space-y-2">
                        <div className="rounded-xl overflow-hidden w-[530px] h-[515px] ">
                            <Image src={item.image} alt={item.title} style={{ objectFit: "cover" }} height={515} width={530} />

                        </div>
                        <div className="flex flex-row justify-center gap-x-3  w-[530px] items-center">
                            {[...Array(4)].map((_, index) => {
                                return (
                                    <div className="w-[118px] rounded-xl overflow-hidden h-[118px]">
                                        <Image src={item.image} alt={item.title} style={{ objectFit: "cover" }} height={118} width={118} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col justify-start">
                        <div className="basis-1/4 flex flex-col justify-center">
                            <div className="font-bold text-[40px]">{item.title}</div>
                        </div>

                        <div className="flex basis-3/4 flex-col  py-5 justify-center space-y-8">

                            <div>
                                <div className="text-[16px]">{item.description}</div>
                            </div>
                            <div>
                                <div className="text-white text-[16px]">Price</div>
                                <div className="text-white  text-[40px]">{item.price} SOL</div>
                            </div>
                            <div>
                                <div className="text-white text-[16px]">Minted</div>
                                <div className="text-white text-[40px]">4</div>
                            </div>

                        </div>

                        <div className="text-wrap w-full p-2 rounded overflow-hidden">
                            <p>{${`https://www.dial.to/?action=solana-action:http://localhost:3000/api/actions/mint?description=${encodeURIComponent(item.description)}&title=${encodeURIComponent(item.title)}&amount=${item.price}`}}
                            </p>
                        </div>

                        <div className="justify-center basis-1/4 items-center flex flex-row ">
                            <a target="_blank" href={`https://www.dial.to/?action=solana-action:http://localhost:3000/api/actions/mint?description=${encodeURIComponent(item.description)}&title=${encodeURIComponent(item.title)}&amount=${item.price}`} className="rounded-xl bg-[#59E4C0] py-5 text-[#03634A] p-2 text-[16px] text-center w-full m-auto">Mint Here</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
