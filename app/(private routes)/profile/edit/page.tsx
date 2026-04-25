"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  getApiErrorMessage,
  getMe,
  updateMe,
} from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./EditProfilePage.module.css";

export default function EditProfile() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const {
    data: user,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const { mutate, error: mutationError, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      router.push("/profile");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();

    mutate({ username });
  };

  if (isLoading) {
    return <main className={css.mainContent}>Loading profile...</main>;
  }

  if (queryError || !user) {
    return (
      <main className={css.mainContent}>
        {getApiErrorMessage(queryError, "Failed to load profile")}
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={user.username}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
          {mutationError && (
            <p className={css.error}>
              {getApiErrorMessage(mutationError, "Failed to update profile")}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
