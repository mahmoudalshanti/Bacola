import React from "react";
import Origin from "./_components/Origin";
import Logo from "../_components/Logo";

export default async function Page() {
  return (
    <main className="max-w-md p-5 mx-auto mt-7">
      <div className="text-xl font-medium mb-3 ">
        <Logo wieght={"normal"} horizontal={"start"} />
      </div>
      <p className="text-3xl text-slate-700 font-semibold max-w-lg mb-3">
        Enter your email to join us or sign in.
      </p>
      <Origin />
    </main>
  );
}
