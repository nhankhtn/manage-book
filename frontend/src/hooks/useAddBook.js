import { useState } from "react";
import { object, string,number } from "yup";
export const useAddBook = () => {
  const [errors, setErrors] = useState({
    title: "",
    author: "",
    category: "",
    quantity: "",
    price: "",
  });




  let addSchema = object({
    title: string().required("Bạn chưa điền tên sách"),
    author: string().required("Bạn chưa điền tác giả"),
    category: string().required("Bạn chưa điền thể loại"),
    quantity: number().required("Bạn chưa điền số lượng").positive("Số lượng phải lớn hơn 0"),
    price: number().required("Bạn chưa điền giá tiền").positive("Giá tiền phải lớn hơn 0"),
  });

  const validate = async (formData) => {
    try {
      await addSchema.validate(formData, { abortEarly: false });
    } catch (validationErrors) {
      const firstError = validationErrors.inner[0];
      const formattedErrors = {
        [firstError.path]: firstError.message,
      };
      setErrors(formattedErrors);
      throw Error("error");
    }
  };

  return { errors, validate };
};
