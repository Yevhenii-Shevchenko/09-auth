"use client";

type NotesErrorProps = {
  error: Error;
  reset: () => void;
  unstable_retry: () => void;
};

const NotesError = ({ error }: NotesErrorProps) => {
  return (
    <p role="alert">
      Something went wrong. {error.message}
    </p>
  );
};

export default NotesError;
