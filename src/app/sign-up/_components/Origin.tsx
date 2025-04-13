"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import SelectCountry from "./Select";
import EmailInput from "./EmailInput";
import ContinueButton from "./Button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "./ErrorMessage";

function Origin() {
  const [country, setCountry] = useState<string>("");
  const [flagUrl, setFlagUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);

        // Fetch user's country based on IP address
        const { data } = await axios.get(
          `https://ipinfo.io?token=${process.env.NEXT_PUBLIC_IP_TOKEN}`
        );

        const userCountry = data?.country || "Unknown";
        setCountry(userCountry);
      } catch (error) {
        console.error("Error fetching country:", error);
        setCountry("Unknown");
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, []);

  useEffect(() => {
    if (!country || country === "Unknown") return;

    const fetchFlag = async () => {
      try {
        setLoading(true);

        // Fetch the country flag using the country code
        const { data } = await axios.get(
          `https://restcountries.com/v3.1/alpha/${country.toLowerCase()}`
        );

        setFlagUrl(data[0]?.flags?.svg || null);
      } catch (error) {
        console.error("Error fetching flag:", error);
        setFlagUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFlag();
  }, [country]);

  const handleSelectChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
  };

  return (
    <div>
      {errMsg && (
        <div className="mt-4">
          <ErrorMessage errMsg={errMsg} />
        </div>
      )}

      {loading ? (
        <div className="max-w-md space-y-5">
          <Skeleton className="h-[40px] bg-gray-200" />
          <Skeleton className="h-[60px] bg-gray-200" />
          <Skeleton className="h-[30px] bg-gray-200" />
        </div>
      ) : (
        <>
          <div className="flex items-center mb-9">
            {flagUrl && (
              <img
                src={flagUrl}
                alt="Country Flag"
                className="w-14 h-auto mr-2"
              />
            )}
            <p className="text-lg font-semibold">{country.toUpperCase()}</p>
            <SelectCountry
              setCountry={setCountry}
              country={country}
              handleSelectChange={handleSelectChange}
            />
          </div>

          <EmailInput
            email={email}
            setEmail={setEmail}
            setIsValidEmail={setIsValidEmail}
            isValidEmail={isValidEmail}
          />

          <p className="text-gray-700 text-lg">
            By continuing, I agree to Bacola’s{" "}
            <span className="underline cursor-pointer">Privacy Policy</span> and{" "}
            <span className="underline cursor-pointer">Terms of Use</span>.
          </p>

          <ContinueButton
            errMsg={errMsg}
            setErrMsg={setErrMsg}
            email={email}
            isValidEmail={isValidEmail}
            country={{ flag: flagUrl || "", name: country || "" }}
          />
        </>
      )}
    </div>
  );
}

export default Origin;
