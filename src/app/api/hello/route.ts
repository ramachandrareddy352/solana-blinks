import {ActionGetResponse, ActionPostResponse, ActionPostRequest, ACTIONS_CORS_HEADERS} from "@solana/actions";
import { headers } from "next/headers";
import {Transaction, PublicKey, SystemProgram, Connection, clusterApiUrl} from "@solana/web3.js";
import { access } from "fs";

export async function GET(request: Request) {
  const response: ActionGetResponse =  {
    icon:"https://file.coin98.com/thumbnail/transfer-tokens-to-solana-blockchain.png",
    title:"Transfer SOL",
    label:"Transfer",
    description:"Transfer your SOL using blinks on devnet",
    error:{
      message:"Transfer failed"
    },
    links:{
      actions:[
        {
          type:"transaction",
          href:request.url,
          label:"Null Transfer"
        },
        {
          type:"transaction",
          href:request.url+"?action=another",
          label:"Transfer 1 SOL"
        },
        {
          type:"transaction",
          href:request.url+"?action=param&receiver={receiver}&amount={amount}",
          label:"Transfer with params",
          parameters:[
            {
              name:'receiver',
              label:'Receiver',
              required:true,
            },
            {
              name:'amount',
              label:'Amount',
              required:true,
            }
          ]
        }
      ]
    },
  }
  return Response.json(response,{headers: ACTIONS_CORS_HEADERS})
}

export async function POST(request: Request) {
  const requestBody: ActionPostRequest = await request.json();
  const userPubKey = requestBody.account;
  console.log(userPubKey);

  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const reciver = url.searchParams.get("receiver");
  const amount = url.searchParams.get("amount");
  console.log("Action => "+action);
 
  const connection = new Connection(clusterApiUrl("devnet"));
  const tx = new Transaction();

  // sending one tooken using blinks
  const ix = SystemProgram.transfer({
    fromPubkey: new PublicKey(userPubKey),
    toPubkey: new PublicKey("Ezapurmy7RCgNo2F41xSsf6yk5mvtStkoqVQnw9fkaqN"),
    lamports: 1000000000,
  })

  if(action == "another") {
    tx.add(ix);
  } else if(action == 'param' && reciver && Number(amount) > 0) {
    const ix2 = SystemProgram.transfer({
      fromPubkey: new PublicKey(userPubKey),
      toPubkey: new PublicKey(reciver),
      lamports: Number(amount),
    })
    tx.add(ix2);
  }
  
  // constructing data
  tx.feePayer = new PublicKey(userPubKey);
  tx.recentBlockhash = (await connection.getLatestBlockhash({commitment:"finalized"})).blockhash;
  const serialTx = tx.serialize({requireAllSignatures:false, verifySignatures:false}).toString("base64");

  const response: ActionPostResponse = {
    type:"transaction",
    transaction:serialTx,
    message:"SOL transferred successfully",
  }

  return Response.json(response, {headers: ACTIONS_CORS_HEADERS});
}

export async function OPTIONS(request: Request) {
  return new Response(null, {headers: ACTIONS_CORS_HEADERS});

}