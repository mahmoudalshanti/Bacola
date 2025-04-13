import { InfoIcon } from "lucide-react";
const ErrorMessage = ({ errMsg }: { errMsg?: string }) => {
  return (
    <div className="bg-gray-200 p-2 flex items-center mb-5">
      <InfoIcon className="text-red-600 mr-2 w-5" />
      <p className="text-base">{errMsg}</p>
    </div>
  );
};

export default ErrorMessage;
