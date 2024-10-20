import { useState } from "react";
import Button from "../Button";
import styles from "./FormAddBook.module.scss";
export default function FormAddBook( {handleAdd} ) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    quantity: 0,
    price: 0,
  });
  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((preValues) => {
      return {
        ...preValues,
        [id]: value,
      };
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.category) {
      alert("Please fill all fields");
      return;
    }
    if(formData.quantity <= 0 || formData.price <= 0) {
      alert("Quantity and price must be greater than 0");
      return;
    }
    const book = formData;
    handleAdd(book);
  }
  return (
    <div className={styles.container}>
      <div className={styles.title} >Add Book</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" >Tên sách</label>
          <input id="title" type="text" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="author">Tác giả</label>
          <input id="author" type="text" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="category">Thể loại</label>
          <input id="category" type="text" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="quantity">Số lượng</label>
          <input id="quantity" type="number" onChange={handleChange} defaultValue={0} />
        </div>
        <div>
          <label htmlFor="price" >Giá</label>
          <input id="price" type="number" onChange={handleChange} defaultValue={0} />
        </div>
        <Button className={styles.submitBtn} type="submit">Submit</Button>
      </form>
    </div>
  )
}