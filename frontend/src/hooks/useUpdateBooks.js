import { useState, useCallback } from "react";
import { updateBooks } from "@/services/updateService";
import useModalAlert from "@/hooks/useModal";
export const useUpdateBooks = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const { openModalAlert } = useModalAlert();
  const [showModalBooksErr, setShowModalBooksErr] = useState(false);
  const [books, setBooks] = useState([
    {
      title:
        "Lập trình RLập trình ReacLập trìnhtrình ReacLập trìnhcLập trình",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 10000,
    },
  ]);
  const [booksErr, setBooksErr] = useState([]);
  function deleteAt(index) {
    setBooks((preValues) => {
      return preValues.filter((value, i) => i !== index);
    });
  }
  function add(book) {
    setBooks((preValues) => {
      return [...preValues, book];
    });
    setErr(false);
  }
  const importBook = async () => {
    if (books.length === 0) {
      setErr(true);
      return;
    }
    try {
      setLoading(true);
      const result = await updateBooks(books);
      if (result.length > 0) {
        const bookErr= result.map((res) => {
          const [quantity, ...rest] = res.split(" ");
          const title = rest.join(" ");
          return {
            title,
            quantity,
          }
        });
        setBooksErr(bookErr);
        setShowModalBooksErr(true);
      } else {
        openModalAlert(true);
      }
      setBooks([]);
    } catch (error) {
      console.log(error);
      openModalAlert(false);
    } finally {
      setLoading(false);
    }
  };

  return { err, loading, importBook, deleteAt, add, books, showModalBooksErr, setShowModalBooksErr, booksErr };
};
