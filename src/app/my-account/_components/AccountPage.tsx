"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { actionGetFullUserInfo } from "../../dashboard/_actions/actionDashboard";
import getUser from "../../_components/getUser";
import { capitalizeIfAmpersand, passwordCheck } from "@/lib/utils";
import PasswordStrengthMeter from "../../sign-up/info/[id]/_components/PasswordStrengthMeter";
import { actionUpdateUser } from "../../dashboard/_actions/actionDashboard";
import { ToastFormSuccess } from "@/components/Toasts";
import axios from "axios";

interface Country {
  name: string;
  flag: string;
  code: string;
}

const AccountPage = () => {
  const [touched, setTouched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [profileErrors, setProfileErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [form, setForm] = useState({
    fName: "",
    lName: "",
    email: "",
    dateOfBirth: new Date(),
    country: {
      name: "",
      flag: "",
    },
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const findUser = await getUser();
        if (findUser?.id) {
          const fullInfoUser = await actionGetFullUserInfo(findUser.id);

          if (fullInfoUser) {
            if ("fName" in fullInfoUser)
              setForm({
                fName: fullInfoUser.fName || "",
                lName: fullInfoUser.lName || "",
                email: fullInfoUser.email || "",
                dateOfBirth: fullInfoUser.dateOfBirth
                  ? new Date(fullInfoUser.dateOfBirth)
                  : new Date(),
                country:
                  fullInfoUser.country &&
                  typeof fullInfoUser.country === "object" &&
                  "name" in fullInfoUser.country &&
                  "flag" in fullInfoUser.country
                    ? {
                        name: String(fullInfoUser.country.name),
                        flag: String(fullInfoUser.country.flag),
                      }
                    : { name: "", flag: "" },
              });
          }
        }
      } catch (err) {
        console.error("Something went Error!", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch country data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("/data/countries.json");
        const data = await response.data;
        const countryList = data.map((country: any) => ({
          code: country.cca2,
          name: country.name.common,
          flag: country.flags?.png || "",
        }));
        setCountries(countryList);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "newPassword") {
      setTouched(true);
    }
  };

  const handleCountryChange = (value: string) => {
    const selectedCountry = countries.find((c) => c.name === value);
    setForm({
      ...form,
      country: {
        name: selectedCountry?.name || "",
        flag: selectedCountry?.flag || "",
      },
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setForm({ ...form, dateOfBirth: date });
    }
  };

  const handleUpdateUser = async () => {
    setProfileErrors([]);
    setLoading(true);

    try {
      const { fName, lName, dateOfBirth, country } = form;
      const result = await actionUpdateUser(fName, lName, dateOfBirth, country);

      if ("success" in result)
        if (!result?.success) {
          if ("message" in result) setProfileErrors([result?.message || ""]);
        }

      if (result.success) ToastFormSuccess();

      if ("errMsg" in result && result.errMsg) {
        throw new Error(result.errMsg);
      }
    } catch (err) {
      setProfileErrors([
        err instanceof Error ? err.message : "Something went wrong",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordErrors([]);
    const newErrors: string[] = [];

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    const passwordCriteria = passwordCheck(passwordForm.newPassword);
    const unmetCriteria = passwordCriteria.filter((criteria) => !criteria.met);

    if (unmetCriteria.length > 0) {
      newErrors.push(...unmetCriteria.map((c) => c?.label));
    }

    if (newErrors.length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await actionUpdateUser(
        undefined,
        undefined,
        undefined,
        undefined,
        passwordForm.oldPassword,
        passwordForm.newPassword
      );

      if (!result.success) {
        setPasswordErrors([result.message || ""]);
      } else {
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
      if (result.success) ToastFormSuccess();

      if ("errMsg" in result && result.errMsg) {
        throw new Error(result.errMsg);
      }
    } catch (err) {
      setPasswordErrors([
        err instanceof Error ? err.message : "Something went wrong",
      ]);
      console.error("Something went wrong!", passwordErrors);
    } finally {
      setLoading(false);
    }
  };

  const passwordCriteria = passwordCheck(passwordForm.newPassword);
  return (
    <div className="mt-8 w-full">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profileErrors.length > 0 && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  <ul className="list-disc pl-5">
                    {profileErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>First Name</label>
                  <Input
                    name="fName"
                    value={capitalizeIfAmpersand(form.fName)}
                    onChange={handleInputChange}
                    placeholder={`First Name`}
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <Input
                    name="lName"
                    value={capitalizeIfAmpersand(form.lName)}
                    onChange={handleInputChange}
                    placeholder={`Last Name`}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label>Email Address</label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  disabled
                />
              </div>
              <div className="mt-4">
                <label>Date of Birth</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="pl-3 text-left font-normal w-full"
                    >
                      <span>{format(form.dateOfBirth, "PPP")}</span>
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.dateOfBirth}
                      onSelect={handleDateChange}
                      initialFocus
                      fromYear={1930}
                      toYear={2007}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="mt-4">
                <label>Country</label>
                <Select
                  value={form.country.name}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.name}>
                        <div className="flex items-center gap-2">
                          {c.flag && (
                            <img
                              src={c.flag}
                              alt={c.name}
                              className="w-5 h-3"
                            />
                          )}
                          {c.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleUpdateUser}
                className="mt-6 bg-cyan-600 hover:bg-cyan-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {passwordErrors.length > 0 && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  <ul className="list-disc pl-5">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label>Current Password</label>
                <Input
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="mt-4">
                <label>New Password</label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
                <PasswordStrengthMeter
                  criteria={passwordCriteria}
                  focus={touched}
                />
              </div>
              <div className="mt-4">
                <label>Confirm New Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <Button
                className="mt-6 bg-cyan-600 hover:bg-cyan-700"
                onClick={handlePasswordUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountPage;
