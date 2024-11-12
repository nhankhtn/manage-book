import { useState } from "react";
import Button from "../Button";
import styles from "./FormAddBook.module.scss";
import { useAddBook } from "../../hooks/useAddBook";
export default function FormAddBook( {handleAdd} ) {
  const { errors, validate } = useAddBook();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    quantity: null,
    price: null,
  });
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log(formData);
        await validate(formData);
        handleAdd(formData);
    } catch (err) {
    }
  }
  function handleChange(e) {
    var { id, value } = e.target;
    setFormData((preValues) => {
      return {
        ...preValues,
        [id]:  (id === "quantity" || id ==="price") ? Number(value) : value
      };
    });
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.title} >Add Book</div>
      <form onSubmit={handleSubmit}>
        <div className={!errors.title ? styles.errorGap : ""}>
          <label htmlFor="title" >Tên sách</label>
          <input id="title" type="text" onChange={handleChange} />
          {errors.title && <div className={styles.error}>{errors.title}</div>}
        </div>
        <div className={!errors.author ? styles.errorGap : ""}>
          <label htmlFor="author">Tác giả</label>
          <input id="author" type="text" onChange={handleChange} />
          {errors.author && <div className={styles.error}>{errors.author}</div>}
        </div>
        <div className={!errors.category ? styles.errorGap : ""}>
          <label htmlFor="category">Thể loại</label>
          <input id="category" type="text" onChange={handleChange} />
          {errors.category && <div className={styles.error}>{errors.category}</div>}
        </div>
        <div  className={!errors.quantity ? styles.errorGap : ""}>
          <label htmlFor="quantity">Số lượng</label>
          <input id="quantity" type="number" onChange={handleChange} placeholder="0" />
          {errors.quantity && <div className={styles.error}>{errors.quantity}</div>}
        </div>
        <div  className={!errors.price ? styles.errorGap : ""}>
          <label htmlFor="price" >Giá</label>
          <input id="price" type="number" onChange={handleChange}  placeholder="0" />
          {errors.price && <div className={styles.error}>{errors.price}</div>}
        </div>
        <Button className={styles.submitBtn} type="submit">Submit</Button>
      </form>
    </div>
  )
}