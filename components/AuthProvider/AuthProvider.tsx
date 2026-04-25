"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import {
  checkSession,
  getApiErrorMessage,
  getMe,
} from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./AuthProvider.module.css";

type AuthProviderProps = {
  children: ReactNode;
};

const PRIVATE_PATHS = ["/profile", "/notes"];
const AUTH_PATHS = ["/sign-in", "/sign-up"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const privateRoute = isPrivatePath(pathname);
      const authRoute = AUTH_PATHS.includes(pathname);

      setIsChecking(true);

      try {
        const hasSession = await checkSession();

        if (!isMounted) {
          return;
        }

        if (!hasSession) {
          clearIsAuthenticated();

          if (privateRoute) {
            router.replace("/sign-in");
          }

          return;
        }

        const currentUser = await getMe();

        if (!isMounted) {
          return;
        }

        setUser(currentUser);

        if (authRoute) {
          router.replace("/profile");
        }
      } catch (error) {
        clearIsAuthenticated();

        if (privateRoute) {
          router.replace("/sign-in");
        } else {
          console.error(getApiErrorMessage(error, "Failed to restore session"));
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    syncSession();

    return () => {
      isMounted = false;
    };
  }, [pathname, clearIsAuthenticated, router, setUser]);

  if (isChecking) {
    return <div className={css.loader}>Loading session...</div>;
  }

  return children;
}
