import prisma from "@/lib/prisma";
import Info from "./_components/Info";
import { redirect } from "next/navigation";
import Link from "next/link";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let email: string | undefined = "";
  let findPendingUser: PendingUser | null;

  try {
    findPendingUser = await prisma.pendingUser.findFirst({
      where: { id },
    });

    email = findPendingUser?.email;

    if (!findPendingUser) {
      redirect("/sign-up");
    }
    if ("errMsg" in findPendingUser) {
      if (findPendingUser.errMsg)
        throw new Error(findPendingUser.errMsg as string);
    }
  } catch (error) {
    redirect("/sign-up");
  }

  return (
    <div className="max-w-md p-5 mx-auto mt-7">
      <p className="text-xl font-medium mb-3">Bacola</p>
      <p className="text-3xl font-semibold max-w-lg mb-3">
        Now let's make you a Bacola Member.
      </p>
      <p className="max-w-xs text-md font-semibold text-gray-950">
        {/* Display the email sent to the user and provide a link to edit the email */}
        We've sent a code to {email?.toLowerCase()}
        <Link
          href="/sign-up"
          className="underline text-base cursor-pointer text-slate-600"
        >
          {" "}
          Edit
        </Link>
      </p>

      <Info pendingUser={findPendingUser} />
    </div>
  );
}

export default page;
