import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "../NoteDetails.client";

type Props = {
  params: { id: string };
};

export default async function NoteDetailsPage({ params }: Props) {
  const id = Number(params.id);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <NoteDetailsClient dehydratedState={dehydratedState} />
  );
}
