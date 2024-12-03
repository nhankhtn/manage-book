import { useState, useCallback } from "react";
import { updateBooks } from "@/services/updateService";
import useModalAlert from "@/hooks/useModal";
export const useUpdateBooks = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const { openModalAlert } = useModalAlert();

  const [books, setBooks] = useState([
    {
      title:
        "Lập trình RLập trình ReacLập trìnhtrình ReacLập trìnhcLập trình",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 10000,
    },
    {
      title: "Lập trình React",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 100000,
    },
    {
      title: "Lập trình React",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 100000,
    },
    {
      title: "Lập trình React",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 100000,
    },
    {
      title: "Lập trình React ",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 100000,
    },
    {
      title: "Lập trình React",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 100000,
    },
    {
      title: "Lập trình React",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 100000,
    },
    {
      title: "Lập trình React",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 100000,
    },
    {
      title: "Lập trình React",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 100000,
    },
    {
      title: "Lập trình React",
      author: "React",
      category: "Programming",
      quantity: 10,
      price: 100000,
    },
  ]);
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
      if (result.message === "Lỗi khi cập nhật sách") {
        openModalAlert(false);
      } else {
        openModalAlert(true);
        setBooks([]);
      }
    } catch (error) {
      openModalAlert(false);
    } finally {
      setLoading(false);
    }
  };

  return { err, loading, importBook, deleteAt, add, books };
};
