import { DrawerDialog } from "@/components/Drawer";
import { SetStateAction } from "react";
import SignInPage from "../sign-in/page";

function NotUserDialog({
  setOpen,
  open,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <DrawerDialog
      content={
        <div className=" h-[545px] overflow-y-auto scrollbar-custom-sheet px-5 md:px-0">
          <p className="text-center text-xl text-slate-800 font-semibold">
            Join to Bacola club
          </p>
          <SignInPage />
        </div>
      }
      open={open}
      setOpen={setOpen}
    />
  );
}

export default NotUserDialog;
