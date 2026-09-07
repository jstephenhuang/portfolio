import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AuthError } from "next-auth";

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

export type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export const isOk = <T, E>(result: Result<T, E>): result is Success<T> => result.error === null;
export const isErr = <T, E>(result: Result<T, E>): result is Failure<E> => result.error !== null;

export const ok = <T, E>(data: T): Result<T, E> => ({ data: data, error: null });
export const err = <T, E>(error: E, log: boolean = true): Result<T, E> => {
  if (log) console.error(error);
  return { data: null, error };
};

export function fallbackError(error: unknown): Result<never, Error> {
  const safetyError = error instanceof Error ? error : new Error(String(error));
  return err(new Error("An unexpected error occurred. Please try again later.", { cause: safetyError }));
}

// NextAuth (maybe move it into its own next-auth-error.ts in the future)

export function handleNextAuthError(error: unknown): Result<never, Error> {
  if (isRedirectError(error)) {
    throw error;
  }

  if (error instanceof AuthError) {
    switch (error.type) {
      case "CredentialsSignin": // Failed password/username
        return err(new Error("Invalid email or password.", { cause: error }));
      case "SessionTokenError":
        return err(new Error("Your session expired. Please sign in again.", { cause: error }));
      default:
        return err(new Error("An authentication error occurred.", { cause: error }));
    }
  }

  return fallbackError(error);
}
