import { request } from "./request"

export const createNewsletter = async (
    emailAddress: string,
    fullName: string,
    purpose: string,
    imgUrl: string,
) => {

    let bodyContent = new FormData();
    bodyContent.append("email_address", emailAddress);
    bodyContent.append("full_name", fullName);
    bodyContent.append("purpose", purpose);
    bodyContent.append("img_url", imgUrl);

    let responses = await request.post({ url: '/create-newsletter', data: bodyContent });
    return responses;

}

export const fetchNullMailList = async () => {
    let response = await request.get(`/get-null-maillist`);
    return response;
}
