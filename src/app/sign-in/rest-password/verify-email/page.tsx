import Link from "next/link";
import VerifyEmail from "../_components/VerifyEmail";
import { ArrowLeft } from "lucide-react";

function page() {
  return (
    <div className="max-w-sm p-5 mx-auto mt-7 border border-gray-300 rounded-lg">
      <VerifyEmail />
      <div className="flex mt-2 justify-center ">
        <Link
          href={"/sign-in"}
          className="text-sm text-gray-700 hover:underline flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign in
        </Link>
      </div>
    </div>
  );
}

export default page;
