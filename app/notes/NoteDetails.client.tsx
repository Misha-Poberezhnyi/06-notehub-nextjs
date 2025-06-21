"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import css from "./NoteDetails.module.css";

type Props = {
  dehydratedState: unknown;
};

export default function NoteDetailsClient({ dehydratedState }: Props) {
  const params = useParams();
  const id = Number(params.id);

  return (
    <TanStackProvider dehydratedState={dehydratedState}>
      <NoteDetailsContent id={id} />
    </TanStackProvider>
  );
}

function NoteDetailsContent({ id }: { id: number }) {
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !isNaN(id),
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !note) return <p>Something went wrong.</p>;

  const createdDate = new Date(note.createdAt).toLocaleString();

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <button className={css.editBtn}>Edit note</button>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{createdDate}</p>
      </div>
    </div>
  );
}
