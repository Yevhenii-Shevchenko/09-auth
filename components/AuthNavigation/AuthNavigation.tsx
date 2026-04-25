"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

  const { mutate: logoutUser, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearIsAuthenticated();
      router.push("/sign-in");
    },
  });

  if (isAuthenticated && user) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link
            href="/notes/filter/all"
            prefetch={false}
            className={css.navigationLink}
          >
            Notes
          </Link>
        </li>

        <li className={css.navigationItem}>
          <Link
            href="/profile"
            prefetch={false}
            className={css.navigationLink}
          >
            Profile
          </Link>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user.email}</p>
          <button
            type="button"
            className={css.logoutButton}
            onClick={() => logoutUser()}
            disabled={isPending}
          >
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
