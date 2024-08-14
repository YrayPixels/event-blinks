import pako from "pako";

export const compressUrl = async (url: any) => {
    //to Json String
    const jsonString = JSON.stringify(url);
    //To Gzip
    const compressed = pako.gzip(jsonString);
    //To Base64
    const base64Encoded = Buffer.from(compressed).toString('base64');

    return base64Encoded;

}

export const decompressedUrl = async (stringUrl: any) => {


    // Step 1: Decode base64 to buffer
    const compressedRe = Buffer.from(stringUrl, 'base64');

    // Step 2: Unzip the buffer
    const decompressedRe = pako.ungzip(compressedRe);

    // Step 3: Convert buffer to string
    const jsonStringRe = Buffer.from(decompressedRe).toString('utf-8');

    return jsonStringRe;

}

export const API_URL = process.env.NEXT_PUBLIC_ENVIROMENT == "development" ? "http://127.0.0.1:8000/api" : "http://ytechno.com.ng/api"
