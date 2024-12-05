import { useState } from "react";
import { object, string,number } from "yup";
import { useStore } from "./useStore";
export const useAddBook = () => {
  const {
    state: { config : {minImportQuantity}  },
  } = useStore();
  const [errors, setErrors] = useState({
    title: "",
    author: "",
    category: "",
    amount: "",
    price: "",
  });

  let addSchema = object({
    title: string().required("Bạn chưa điền tên sách").max(70, "Tên sách chỉ được tối đa 70 ký tự"),
    author: string().required("Bạn chưa điền tác giả").max(50, "Tên tác giả chỉ được tối đa 50 ký tự"),
    category: string().required("Bạn chưa điền thể loại").max(30, "Tên thể loại chỉ được tối đa 30 ký tự"),
    quantity: number().required("Bạn chưa điền số lượng").min(minImportQuantity,`Số lượng sách phải từ ${minImportQuantity} trở lên`),
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
