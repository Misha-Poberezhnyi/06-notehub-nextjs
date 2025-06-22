"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Toaster } from "react-hot-toast";

import NoteList from "../../components/NoteList/NoteList";
import Pagination from "../../components/Pagination/Pagination";
import NoteModal from "../../components/NoteModal/NoteModal";
import SearchBox from "../../components/SearchBox/SearchBox";
import QueryStatus from "../../components/QueryStatus/QueryStatus";

import css from "./Notes.module.css";

import type { NotesResponse } from "@/types/noteApi";
import { fetchNotes } from "@/lib/api";

type Props = {
  initialData: NotesResponse;
};

function NotesInner({ initialData }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  useEffect(() => {
    setCurrentPage(prev => (prev !== 1 ? 1 : prev));
  }, [searchTerm]);

  const {
    data = initialData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", debouncedSearch, currentPage],
    queryFn: () => fetchNotes(debouncedSearch, currentPage),
    placeholderData: previousData => previousData,
  });

  const notes = data.notes || [];
  const totalPages = data.totalPages || 1;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSearchChange = (value: string) => setSearchTerm(value);
  const handlePageChange = (selected: number) => setCurrentPage(selected + 1);

  return (
    <div className={css.app}>
      <Toaster position="top-right" />

      <header className={css.toolbar}>
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>

        <SearchBox value={searchTerm} onChange={handleSearchChange} />

        {isFetching && !isLoading && <span className={css.spinner} />}
      </header>

      <QueryStatus
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && notes.length === 0}
        emptyMessage="No notes found"
      />

      {notes.length > 0 && <NoteList notes={notes} />}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={({ selected }) => handlePageChange(selected)}
        />
      )}

      {isModalOpen && <NoteModal onClose={handleCloseModal} />}
    </div>
  );
}

const queryClient = new QueryClient();

export default function NotesClient({ initialData }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <NotesInner initialData={initialData} />
    </QueryClientProvider>
  );
}
