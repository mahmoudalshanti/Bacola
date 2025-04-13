"use client";

import { useEffect, useState } from "react";
import PersonalInfo from "./PersonalInfo";
import Password from "./Password";
import Birth from "./Birth";
import CheckBox from "./CheckBox";
import Code from "./Code";
import CreateButton from "./Button";
import ErrorMessage from "@/app/sign-in/_components/ErrorMessage";

function Info({ pendingUser }: { pendingUser: PendingUser }) {
  const [code, setCode] = useState<string>("");
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  const [isValidFName, setIsValidFName] = useState<boolean>(false);
  const [isValidLName, setIsValidLName] = useState<boolean>(false);
  const [isValidDate, setIsValidDate] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [fName, setFName] = useState<string>("");
  const [lName, setLName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [day, setDay] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const [disabled, setDisabled] = useState<boolean>(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (
      isValidPassword &&
      isValidFName &&
      code.length &&
      isValidLName &&
      isValidDate &&
      isChecked
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [
    isValidDate,
    isChecked,
    isValidFName,
    isValidLName,
    isValidPassword,
    code.length,
  ]);

  // Effect to auto-fill code if the user has OAuth authentication enabled
  useEffect(() => {
    if (pendingUser.OAuth) setCode("0000"); // Set default code when OAuth is used
  }, []);

  return (
    <div>
      {errMsg && (
        <div className="mt-5">
          <ErrorMessage errMsg={errMsg} />{" "}
        </div>
      )}

      {/* Render the Code component if OAuth is not available */}
      {!pendingUser?.OAuth && <Code code={code} setCode={setCode} />}

      <PersonalInfo
        fName={fName}
        lName={lName}
        setFName={setFName}
        setLName={setLName}
        isValidFName={isValidFName}
        setIsValidFName={setIsValidFName}
        isValidLName={isValidLName}
        setIsValidLName={setIsValidLName}
      />

      <Password
        isValidPassword={isValidPassword}
        setIsValidPassword={setIsValidPassword}
        password={password}
        setPassword={setPassword}
      />

      <Birth
        setIsValidDate={setIsValidDate}
        isValidDate={isValidDate}
        day={day ?? null}
        setDay={setDay}
        month={month ?? null}
        setMonth={setMonth}
        year={year ?? null}
        setYear={setYear}
      />

      <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />

      <CreateButton
        setErrMsg={setErrMsg}
        disabled={disabled}
        code={code}
        isChecked={isChecked}
        fName={fName}
        lName={lName}
        password={password}
        birth={{ day, month, year }}
      />
    </div>
  );
}

export default Info;
