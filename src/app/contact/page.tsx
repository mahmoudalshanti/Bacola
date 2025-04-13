"use client";

import React, { useEffect, useState } from "react";
import NavigationBar from "../_components/NavigationBar";
import { Mail, Phone, MapPin, Loader2, User } from "lucide-react";
import {
  actionCreateMessage,
  actionGetFullUserInfo,
} from "../dashboard/_actions/actionDashboard";
import { useUser } from "../_context/UserProvider";

function Page() {
  const [user, setUser] = useState<User | null>();
  const [formData, setFormData] = useState({
    name: user?.fName || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { user: miniUser } = useUser();

  useEffect(() => {
    const getFullUserInfo = async () => {
      if (miniUser?.id) {
        const findUser = await actionGetFullUserInfo(miniUser?.id || "");
        setUser(findUser as unknown as User);
      }
    };
    getFullUserInfo();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Replace with your actual API call
      const response = (await actionCreateMessage(formData)) as {
        success: boolean;
        errMsg?: string;
      };

      if (response.success) {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        if (response.errMsg) {
          throw new Error(response?.errMsg);
        }
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Something went wrong!", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-[130px] md:p-0 mb-0 md:mb-32">
      <NavigationBar navigation="Contact Us" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Address Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Address</h3>
            <p className="text-gray-600">
              123 Business Street, Suite 100
              <br />
              New York, NY 10001
            </p>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Phone Number</h3>
            <p className="text-gray-600">
              +1 (555) 123-4567
              <br />
              Mon-Fri: 9am-5pm
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-gray-600">
              info@example.com
              <br />
              support@example.com
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mx-auto bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl text-slate-700 font-bold mb-6 text-center">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 px-0 md:px-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Subject"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Your message"
                required
              ></textarea>
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
