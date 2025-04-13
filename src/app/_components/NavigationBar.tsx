import { ChevronRight } from "lucide-react";

function NavigationBar({ navigation }: { navigation: string }) {
  return (
    <div className="flex items-center">
      <p className="text-xs font-semibold text-slate-700">HOME</p>
      <ChevronRight className="size-4 text-gray-500 font-semibold " />
      <p className="text-xs text-gray-500 font-semibold">
        {navigation.toUpperCase()}
      </p>
    </div>
  );
}

export default NavigationBar;
