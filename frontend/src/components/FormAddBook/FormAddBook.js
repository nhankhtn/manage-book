import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import styles from "./FormAddBook.module.scss";
import { useAddBook } from "../../hooks/useAddBook";
import { searchAvailableBooks } from "@/services/searchService";

export default function FormAddBook({ handleAdd }) {

  const [menuItems, setMenuItems] = useState([]);
  const [originalMenuItems, setOriginalMenuItems] = useState([
    {
      title: "Nhập sách mới",
      author: "",
      category: "",
      quantity: 0,
      price: 0,
    },
  ]);
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState("Nhập sách mới")
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const { errors, validate } = useAddBook();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    quantity: null,
    price: null,
  });

  const toggleDropdown = (e) => {
    e.preventDefault()
    setIsOpen(!isOpen)
    setMenuItems(originalMenuItems)
    inputRef.current.value = ""
  }

  const handleItemClick = (e, item) => {
    e.preventDefault()
    setSelectedItem(item.title)
    inputRef.current.value = item.title
    setFormData({
      title: item.title === "Nhập sách mới" ? "" : item.title,
      author: item.author,
      category: item.category,
      quantity: 0,
      price: item.price,
    })
    setIsOpen(false)
  }
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase()
    const filteredItems = originalMenuItems.filter((item, index) => item.title.toLowerCase().includes(searchValue) || index === 0)
    setMenuItems(filteredItems)
  }
  // handle click outside for input value
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        inputRef.current.value = selectedItem
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedItem])
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setMenuItems(originalMenuItems)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    async function getAvailableBooks() {
      try {
        // Call API to get available books
        const books = await searchAvailableBooks()
        setOriginalMenuItems(prev => [...prev, ...books])
        setMenuItems([...originalMenuItems, ...books])
      } catch (error) {
        console.log(error.message)
      }
    }
    getAvailableBooks();
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  function removeRedundantSpaces(formData) {
    return Object.keys(formData).reduce((acc, key) => {
      if (typeof formData[key] === "number") acc[key] = formData[key];
      else
        acc[key] = formData[key]
          ?.split(" ")
          .filter((s) => s)
          .join(" ");
      return acc;
    }, {});
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const form = removeRedundantSpaces(formData);
      setFormData(form);
      await validate(form);
      handleAdd(form);
    } catch (err) { }
  }
  function handleChange(e) {
    var { id, value } = e.target;
    setFormData((preValues) => {
      return {
        ...preValues,
        [id]: id === "quantity" || id === "price" ? Number(value) : value,
      };
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Thêm sách</div>

      <div className={styles.dropdown} ref={dropdownRef}>
        <label className={styles.label}>
          Các sách có thể nhập thêm
        </label>
        <input
          ref={inputRef}
          className={styles.dropdown_toggle}
          href="#"
          role="button"
          onClick={toggleDropdown}
          onChange={handleSearchChange}
          aria-expanded={isOpen}
        />


        <ul className={`${styles.dropdown_menu} ${isOpen ? styles.show : ''}`}>
          {menuItems && menuItems.map((item, index) => (
            <li key={index}>
              <a
                className={styles.dropdown_item}
                href="#"
                onClick={(e) => handleItemClick(e, item)}
              >
                {item.title}
                {index !== 0 &&
                  <div className={styles.dropdown_item_info}>
                    <div>
                      Tác giả: <span>{item.author} &#x2022; </span>
                    </div>
                    <div>
                      Thể loại: <span>{item.category}</span>
                    </div>
                  </div>
                }


              </a>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={!errors.title ? styles.errorGap : ""}>
          <label htmlFor="title">Tên sách</label>
          <input id="title" type="text" onChange={handleChange} value={formData.title} />
          {errors.title && <div className={styles.error}>{errors.title}</div>}
        </div>
        <div className={!errors.author ? styles.errorGap : ""}>
          <label htmlFor="author">Tác giả</label>
          <input id="author" type="text" onChange={handleChange} value={formData.author} />
          {errors.author && <div className={styles.error}>{errors.author}</div>}
        </div>
        <div className={!errors.category ? styles.errorGap : ""}>
          <label htmlFor="category">Thể loại</label>
          <input id="category" type="text" onChange={handleChange} value={formData.category} />
          {errors.category && (
            <div className={styles.error}>{errors.category}</div>
          )}
        </div>
        <div className={!errors.quantity ? styles.errorGap : ""}>
          <label htmlFor="quantity">Số lượng</label>
          <input
            id="quantity"
            type="number"
            onChange={handleChange}
            placeholder="0"
            value={formData.quantity ? formData.quantity : ""}
          />
          {errors.quantity && (
            <div className={`${styles.error} error`}>{errors.quantity}</div>
          )}
        </div>
        <div className={!errors.price ? styles.errorGap : ""}>
          <label htmlFor="price">Giá</label>
          <input
            id="price"
            type="number"
            onChange={handleChange}
            placeholder="0"
            value={formData.price ? formData.price : ""}
          />
          {errors.price && <div className={styles.error}>{errors.price}</div>}
        </div>
        <Button className={styles.submitBtn} id="btn-form-add-book" type="submit">
          Xác nhận
        </Button>
      </form>

    </div>
  );
}
