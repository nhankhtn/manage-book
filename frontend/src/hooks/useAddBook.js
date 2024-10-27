import { useState } from "react";

export const useAddBook = () => {
  const [errors, setErrors] = useState({
    title: '',
    author: '',
    category: '',
    quantity: '',
    price: ''
  });

  function validate(formData) {
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
      return false;
    }
    return true;

  }

    return {  errors, validate };
}
