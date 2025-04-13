"use server";

import prisma from "@/lib/prisma";
import {
  sendPasswordRestEmail,
  sendResetSuccessEmail,
} from "@/mailtrap/emails";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generateToken, passwordCheck } from "@/lib/utils";
import { cookies, headers } from "next/headers";
import { auth, signIn } from "@/lib/auth";
import { actionContinue } from "@/app/sign-up/_actions/actionSignup";
import { revalidatePath } from "next/cache";

// ======================== User Sign-in ========================
/**
 * Sign-in action: Verifies user credentials and sets a session token.
 * @param email - User email
 * @param password - User password
 * @throws Error if user is not found or password is incorrect
 */
export async function actionSignin(email: string, password: string) {
  try {
    const findUser = await prisma.user
      .findUnique({ where: { email } })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!findUser) throw new Error("Email not found");

    const checkPwd = await bcrypt.compare(password, findUser.password);
    if (!checkPwd) throw new Error("Password not correct");

    const token = generateToken(findUser.id, "user", findUser.email);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    revalidatePath("/");
    return { redirect: "/", user: findUser };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
}

// ======================== Password Recovery - Forget Password ========================
/**
 * Initiates password recovery by sending a reset email.
 * @param email - User email
 * @throws Error if user is not found or email cannot be sent
 */
export async function actionForgetPassword(email: string) {
  try {
    // Find user by email
    const findUser = await prisma.user
      .findUnique({ where: { email } })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    // If user not found, throw error
    if (!findUser) throw new Error("Invalid Email");

    // Generate a unique reset token and expiry time
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour expiry

    // Store reset token and expiry time in the database
    await prisma.user
      .update({
        where: { id: findUser.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordTokenExpiresAt: resetTokenExpiresAt,
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    // Get the origin for generating the password reset URL
    const headerList = headers();
    const origin =
      (await headerList).get("origin") ||
      (await headerList).get("referer") ||
      "";

    // Send password reset email with reset token link
    try {
      await sendPasswordRestEmail(
        findUser.email,
        `${origin}/sign-in/rest-password/${resetToken}`
      );
    } catch (err) {
      throw new Error("Error sending email or Invalid email");
    }

    return;
  } catch (err) {
    // Handle errors and return message
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
}

// ======================== Password Reset ========================
/**
 * Resets the user's password after validating the token and password criteria.
 * @param token - Password reset token
 * @param password - New password
 * @throws Error if the token is invalid, expired, or password criteria is not met
 */
export async function actionRestPassword(token: string, password: string) {
  try {
    // Find user based on the reset token and check if token has expired
    const findUser = await prisma.user
      .findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordTokenExpiresAt: { gt: new Date() }, // Ensure token is not expired
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    // If no user found or token is expired, throw error
    if (!findUser) throw new Error("Invalid token or Expired date");

    // Validate the new password against the defined criteria
    const isValidPassword = passwordCheck(password).every(
      (c) => c.met === true
    );
    if (!isValidPassword) throw new Error("Invalid password");

    // Hash the new password before saving it
    const hashPwd = await bcrypt.hash(password, 10);

    // Update user's password and clear the reset token fields
    const user = await prisma.user
      .update({
        where: { id: findUser.id },
        data: {
          password: hashPwd,
          resetPasswordToken: null, // Clear reset token
          resetPasswordTokenExpiresAt: null, // Clear reset token expiry
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    // Send a success email after password reset
    try {
      await sendResetSuccessEmail(user.email);
    } catch (error) {
      throw new Error("Error sending email or Invalid email");
    }

    return;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
}

export const actionContinueGoogle = async (email: string) => {
  try {
    // Call actionContinue to handle the rest of the logic
    const data = await actionContinue(email, { name: "", flag: "" }, true);

    return data; // Return the redirect data
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    return { errMsg: message };
  }
};
