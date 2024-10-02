import { useState } from "react";
import Button from "../Button";
import styles from "./FormAddBook.module.scss";
export default function FormAddBook() {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    genre: "",
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
    //validate ...
    console.log(formData);
  }
  return (
    <div className = {styles.container}>
      <div className = {styles.title} >Add Book</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" >Tên sách</label>
          <input id ="name" type="text" onChange={handleChange} />
        </div>
        <div>
          <label  htmlFor="author">Tác giả</label>
          <input id="author" type="text" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="genre">Thể loại</label>
          <input id="genre" type="text" onChange={handleChange}/>
        </div>
        <div>
          <label htmlFor="quantity">Số lượng</label>
          <input id="quantity" type="number"onChange={handleChange}  defaultValue={0}/>
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