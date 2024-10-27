import { useState } from "react";
import Button from "../Button";
import styles from "./FormAddBook.module.scss";
export default function FormAddBook( {handleAdd} ) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    quantity: null,
    price: null,
  });
  const [errors, setErrors] = useState({
    title: '',
    author: '',
    category: '',
    quantity: '',
    price: ''
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
    // if (!formData.title || !formData.author || !formData.category) {
    //   alert("Please fill all fields");
    //   return;
    // }
    // if(formData.quantity <= 0 || formData.price <= 0) {
    //   alert("Quantity and price must be greater than 0");
    //   return;
    // }
    // Validate input and set error messages
    let validationErrors = {
      title: '',
      author: '',
      category: '',
      quantity: '',
      price: ''
    };
    let hasErr= false;
    if (formData.title.trim() === '') {
        validationErrors.title = 'Title is required';
        hasErr= true;
    }
    else if (formData.author.trim() === '') {
        validationErrors.author = 'Author is required';
        hasErr= true;
    }
    else if (formData.category.trim() === '') {
        validationErrors.category = 'Category is required';
        hasErr= true;
    }
    else if (formData.quantity <= 0) {
        validationErrors.quantity = 'Quantity must be greater than 0';
        hasErr= true;
    }
    else if (formData.price <= 0) {
        validationErrors.price = 'Price must be greater than 0';
        hasErr= true;
    }
    if(hasErr) {
      setErrors(validationErrors);
      return;
    }
    const book = formData;
    handleAdd(book);
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