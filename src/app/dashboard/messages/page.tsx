import React from "react";
import Messages from "./_components/Messages";
import { actionGetMessages } from "../_actions/actionDashboard";

async function Page() {
  let messages: Message[];
  try {
    messages = (await actionGetMessages()) as Message[];

    if ("errMsg" in messages) {
      if (messages.errMsg) throw new Error(messages.errMsg as string);
    }
  } catch (err) {
    console.error("Something went Error!", err);
    messages = [];
  }
  return (
    <div>
      <Messages messages={messages} />
    </div>
  );
}

export default Page;
