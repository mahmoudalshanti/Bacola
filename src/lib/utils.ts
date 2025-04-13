import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function decodeUrlString(encodedString: string): string {
  try {
    return decodeURIComponent(encodedString.replace(/\+/g, " "));
  } catch (e) {
    console.error("Failed to decode URL string:", e);
    return encodedString; // Return original if decoding fails
  }
}

const nameRegex = /^[A-Za-z]+$/;

const nameSchema = z
  .string()
  .min(1, { message: "This field is required" })
  .regex(nameRegex, { message: "Only letters are allowed" });

export function nameCheck(name: string) {
  return nameSchema.safeParse(name).success;
}

const emailSchema = z.string().email("Invalid email");

export function emailCheck(email: string) {
  return emailSchema.safeParse(email).success;
}

export function passwordCheck(password: string) {
  return [
    { label: "At least 6 characters", met: password.length >= 6 },
    {
      label: "Contains uppercase & lowercase letters",
      met: /[A-Z]/.test(password) && /[a-z]/.test(password),
    },
    { label: "Contains a number", met: /\d/.test(password) },
  ];
}

export function birthCheck(
  day: number | null,
  month: number | null,
  year: number | null
) {
  let check = false;
  if (day && month && year) {
    if (day <= 31 && day >= 1) {
      check = true;
    } else {
      check = false;
      return false;
    }
    if (month <= 12 && month >= 1) {
      check = true;
    } else {
      check = false;
      return false;
    }
    if (year <= 2007 && year >= 1930) {
      check = true;
      return true;
    } else {
      check = false;
      return false;
    }
  }

  return false;
}

export function generateToken(
  id: string,
  role: string = "user",
  email: string = ""
) {
  const token = jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || "token_here",
    {
      expiresIn: "7d",
    }
  );

  return token;
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as { id: string; role: string; email: string };
  } catch (err) {
    throw new Error("Invalid token");
  }
}

const ITEMS_PER_PAGE = 7; // Number of items per page

export function pagination(payload: any[], page: number) {
  const length = payload.length;
  const pages = Math.ceil(length / ITEMS_PER_PAGE);

  if (payload.length <= 0) {
    return {
      currentPage: [],
      no: 0,
      pages: 0,
      step: 0,
    };
  }

  if (page <= 0) page = 1; // Ensure page is at least 1
  if (page > pages) page = pages; // Ensure page doesn't exceed total pages

  const currentPage = payload.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return {
    currentPage,
    no: page,
    pages,
    step: ITEMS_PER_PAGE * page,
  };
}
const ITEMS_PER_PAGE2 = 7;

export function paginationFilter(payload: any[], page: number) {
  const length = payload.length;
  const pages = Math.ceil(length / ITEMS_PER_PAGE2);

  if (payload.length <= 0) {
    return {
      currentPage: [],
      no: 0,
      pages: 0,
      step: 0,
    };
  }

  if (page <= 0) page = 1; // Ensure page is at least 1
  if (page > pages) page = pages; // Ensure page doesn't exceed total pages

  const currentPage = payload.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return {
    currentPage,
    no: page,
    pages,
    step: ITEMS_PER_PAGE * page,
  };
}

export function capitalizeIfAmpersand(str: string) {
  // Check if the string contains '&' with characters on both sides
  if (/.\&./.test(str)) {
    // Split the string into words, capitalize the first letter of each word, and join them back
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatDate = (date: Date | string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};
