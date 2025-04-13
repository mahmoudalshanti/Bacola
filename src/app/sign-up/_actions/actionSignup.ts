"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import generateVerificationCode, {
  birthCheck,
  generateToken,
  nameCheck,
  passwordCheck,
  verifyToken,
} from "@/lib/utils";

import { sendVerificationCode } from "@/mailtrap/emails";
import { InputJsonValue } from "@prisma/client/runtime/library";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Schema for validating email
const emailSchema = z.string().email("Invalid email");

/**
 * Handles the initial sign-up process, including email validation, user existence checks,
 * and sending verification codes.
 * @param email - User's email address
 * @param country - User's country information
 * @param OAuth - Flag indicating if the user is signing up via OAuth
 * @returns Object with redirect path or throws an error
 */

export async function actionContinue(
  email: string,
  country: { name: string; flag: string },
  OAuth: boolean
) {
  try {
    // Validate email format
    const result = emailSchema.safeParse(email);
    if (result.error) {
      throw new Error("Invalid Email");
    }

    // Clean up expired verification codes and pending users without codes
    await prisma
      .$transaction([
        prisma.verificationCode.deleteMany({
          where: {
            expireIn: {
              lt: new Date(),
            },
          },
        }),
        prisma.pendingUser.deleteMany({
          where: {
            verificationCode: null,
          },
        }),
      ])
      .catch(() => {
        throw new Error("Server not responding");
      });

    // Check if the user already exists in the database
    const existingUserDB = await prisma.user
      .findUnique({ where: { email } })
      .catch(() => {
        throw new Error("Server not responding");
      });
    if (existingUserDB) {
      const token = (await cookies()).get("token");
      if (token) {
        const checkToken = await verifyToken(token.value);

        if (!checkToken || checkToken.id !== existingUserDB.id) {
          throw new Error("Forbbiden");
        } else {
          return { redirect: "/" };
        }
      }
      if (OAuth) {
        const token = generateToken(
          existingUserDB.id,
          "user",
          existingUserDB.email
        );
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return { redirect: "/" };
      }

      return { redirect: "/" };
      // throw new Error("Forbbiden");
    }

    // Check if the user is already in the pending state
    const existingPendingUser = await prisma.pendingUser
      .findUnique({
        where: { email },
      })
      .catch(() => {
        throw new Error("Server not responding");
      });
    if (existingPendingUser) {
      return { redirect: `/sign-up/info/${existingPendingUser.id}` };
    }

    // Generate verification code and set expiration date if not using OAuth
    let expirationDate: Date = new Date();
    let randomCode: string = "";

    if (!OAuth) {
      randomCode = generateVerificationCode();
      expirationDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration
      await sendVerificationCode(email, randomCode); // Send verification email
    }

    // Create a new pending user
    const pendingUser = await prisma.pendingUser
      .create({
        data: {
          email,
          OAuth,
          country: {
            name: country.name,
            flag: country.flag,
          },
        },
      })
      .catch(() => {
        throw new Error("Server not responding");
      });

    // Save the verification code for the pending user
    await prisma.verificationCode
      .create({
        data: {
          code: randomCode,
          expireIn: expirationDate,
          pendingUserId: pendingUser.id,
        },
      })
      .catch(() => {
        throw new Error("Server not responding");
      });

    revalidatePath("/");
    return { redirect: `/sign-up/info/${pendingUser.id}` };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
}

/**
 * Handles user creation after verification and validation.
 * @param id - Pending user ID
 * @param code - Verification code
 * @param fName - User's first name
 * @param lName - User's last name
 * @param password - User's password
 * @param birth - User's date of birth
 * @param check - Flag indicating if the user agreed to privacy terms
 * @returns Object with redirect path and user data or throws an error
 */
export async function actionCreateUser(
  id: string,
  code: string,
  fName: string,
  lName: string,
  password: string,
  birth: {
    day: number | null;
    month: number | null;
    year: number | null;
  },
  check: boolean
) {
  try {
    // Fetch the pending user
    const pendingUser = await prisma.pendingUser
      .findUnique({ where: { id } })
      .catch(() => {
        throw new Error("Server not responding");
      });

    let verificationCode: any;

    // Validate verification code if not using OAuth
    if (!pendingUser?.OAuth) {
      verificationCode = await prisma.verificationCode
        .findUnique({
          where: { code, pendingUserId: id, expireIn: { gt: new Date() } },
          include: {
            pendingUser: true,
          },
        })
        .catch(() => {
          throw new Error("Server not responding");
        });

      if (!verificationCode) {
        throw new Error("Code not valid or expired");
      }
    }

    // Validate first and last names
    const isValidFName = nameCheck(fName);
    const isValidLName = nameCheck(lName);
    if (!isValidFName || !isValidLName)
      throw new Error("First or last name not valid");

    // Validate password
    const isValidPassword = passwordCheck(password).every(
      (c) => c.met === true
    );
    if (!isValidPassword) throw new Error("Password not valid");

    // Validate date of birth
    if (birth.day && birth.month && birth.year) {
      if (
        birth.day.toString().length > 2 ||
        birth.month.toString().length > 2 ||
        birth.year.toString().length > 4
      )
        throw new Error("Date of birth not valid");
    }

    if (!birthCheck(birth.day, birth.month, birth.year))
      throw new Error("Date of birth not valid");

    // Check if the user agreed to privacy terms
    if (!check) throw new Error("Must agree to Shopfaster's privacy terms");

    // Hash the password
    const hashPwd = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user
      .create({
        data: {
          fName: fName.toLowerCase(),
          lName: lName.toLowerCase(),
          email: pendingUser?.email.toLowerCase() ?? "",
          shipping: 0,
          password: hashPwd,
          dateOfBirth: new Date(
            birth.year ?? 0,
            (birth.month ?? 1) - 1,
            birth.day ?? 0
          ),
          country: pendingUser?.country as InputJsonValue,
        },
      })
      .catch(() => {
        throw new Error("Server not responding");
      });

    // Clean up verification code and pending user records
    if (!pendingUser?.OAuth) {
      await prisma.verificationCode
        .delete({
          where: { code, pendingUserId: id, expireIn: { gt: new Date() } },
        })
        .catch(() => {
          throw new Error("Server not responding");
        });
    }

    await prisma.pendingUser
      .delete({
        where: { email: newUser.email },
      })
      .catch(() => {
        throw new Error("Server not responding");
      });

    await createNewCoupon(newUser.id);
    // Send welcome email
    // await sendWelcomeEmail(newUser.email, newUser.fName);

    // Generate and set authentication token in cookies
    const token = generateToken(newUser.id, "user", newUser.email);
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { redirect: `/`, user: newUser };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
}

/**
 * Resends the verification code to the pending user.
 * @param id - Pending user ID
 * @throws Error if the operation fails
 */
export async function reSendCode(id: string) {
  try {
    // Fetch the pending user
    const findPendingUser = await prisma.pendingUser
      .findFirst({
        where: { id },
      })
      .catch(() => {
        throw new Error("Server not responding");
      });

    if (!findPendingUser) throw new Error("Invalid id");

    // Generate a new verification code and set expiration date
    const randomCode = generateVerificationCode();
    const expirationDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

    // Update the verification code in the database
    await prisma.verificationCode
      .update({
        where: {
          pendingUserId: findPendingUser.id,
        },
        data: {
          code: randomCode,
          expireIn: expirationDate,
        },
      })
      .catch(() => {
        throw new Error("Server not responding");
      });

    return;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
}

export const actionContinueAuth = async (
  email: string,
  country: { name: string; flag: string }
) => {
  try {
    const redirect = await actionContinue(email, country, false);

    if (redirect.errMsg) throw new Error(redirect.errMsg);
    return { redirect: redirect.redirect };
  } catch (err) {
    console.log(err);

    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
};

async function createNewCoupon(userId: string) {
  const newCoupon = await prisma.coupon.create({
    data: {
      code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userId: userId,
      isActive: true,
    },
  });

  return newCoupon;
}
