import { useState, useCallback } from "react";
import { updateBooks } from "@/services/updateService";
import useModalAlert from "@/hooks/useModal";
export const useUpdateBooks = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const { openModalAlert } = useModalAlert();
  const [showModalBooksErr, setShowModalBooksErr] = useState(false);
  const [showModalDuplicate, setShowModalDuplicate] = useState(false);
  const [duplicateBook, setDuplicateBook] = useState({});
  const [books, setBooks] = useState([]);
  const [booksErr, setBooksErr] = useState([]);
  function deleteAt(index) {
    setBooks((preValues) => {
      return preValues.filter((value, i) => i !== index);
    });
  }

  function addQuantityToExistingBook(book) {
    const existingBookIndex = books.findIndex(
      (b) =>
        b.title.toLowerCase() === book.title.toLowerCase() &&
        b.author.toLowerCase() === book.author.toLowerCase() &&
        b.category.toLowerCase() === book.category.toLowerCase()
    );
    setBooks((preValues) => {
      const updatedBooks = [...preValues];
      updatedBooks[existingBookIndex] = {
        ...updatedBooks[existingBookIndex],
        quantity: updatedBooks[existingBookIndex].quantity + book.quantity,
      };
      return updatedBooks;
    });
    setShowModalDuplicate(false);
  }
  function add(book) {
    const existingBookIndex = books.findIndex(
      (b) =>
        b.title.toLowerCase() === book.title.toLowerCase() &&
        b.author.toLowerCase() === book.author.toLowerCase() &&
        b.category.toLowerCase() === book.category.toLowerCase()
    );
    if (existingBookIndex !== -1) {
      setShowModalDuplicate(true);

      setDuplicateBook({
        ...book,
        currentQuantity: books[existingBookIndex].quantity,
      });
    }
    else{
      setBooks((preValues) => {
        return [...preValues, book];
      });
    }
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
        const bookErr = result.map((res) => {
          const [quantity, ...rest] = res.split(" ");
          const title = rest.join(" ");
          return {
            title,
            quantity,
          };
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

  return {
    err,
    loading,
    importBook,
    deleteAt,
    add,
    books,
    showModalBooksErr,
    setShowModalBooksErr,
    booksErr,
    showModalDuplicate, 
    setShowModalDuplicate, 
    duplicateBook,
    addQuantityToExistingBook
  };
};
