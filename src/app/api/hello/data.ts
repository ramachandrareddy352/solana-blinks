import {ActionGetResponse, ActionPostResponse, ActionPostRequest, ACTIONS_CORS_HEADERS} from "@solana/actions";
import { headers } from "next/headers";
import {Transaction, PublicKey, SystemProgram} from "@solana/web3.js";

export async function GET(request: Request) {
  const response: ActionGetResponse =  {
    icon:"https://as1.ftcdn.net/jpg/04/18/84/78/1000_F_418847816_XGQjWVdwKDhDyGVwdvdD3w9gyd0sXv3v.jpg",
    title:"Voting Blink",
    label:"Vote",
    description:"This is my blink",
    error:{
      message:"Blink is not implemented"
    }
  }
  return Response.json(response,{headers: ACTIONS_CORS_HEADERS})
}

export async function POST(request: Request) {
  const requestBody: ActionPostRequest = await request.json();
  const userPubKey = requestBody.account;
  console.log(userPubKey);

  const tx = new Transaction();
  tx.feePayer = new PublicKey(userPubKey);
  tx.recentBlockhash = SystemProgram.programId.toBase58();
  const serialTx = tx.serialize({requireAllSignatures:false, verifySignatures:false}).toString("base64");

  const response: ActionPostResponse = {
    type:"transaction",
    transaction:serialTx,
    message:"Not Implemented"
  }

  return Response.json(response, {headers: ACTIONS_CORS_HEADERS});
}

export async function OPTIONS(request: Request) {
  return new Response(null, {headers: ACTIONS_CORS_HEADERS});

}