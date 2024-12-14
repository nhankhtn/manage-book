"use client";

import FormInfoCustomer from "@/components/FormInfoCustomer";
import styles from "./CollectMoney.module.scss";
import Button from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import * as httpRequest from "@/utils/httpRequest";
import useModalAlert from "@/hooks/useModal";
import { createPaymentReceipt } from "@/services/paymentService";
import { useStore } from "@/hooks/useStore";
import { getCustomerDB } from "@/services/getCustomer";
import { useDebounce } from "@/hooks/useDebounce";

export default function CollectMoney() {
  const {
    state: { config },
  } = useStore();
  const { openModalAlert } = useModalAlert();
  const [formInfo, setFormInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    debt: 0,
  });
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const formRef = useRef();
  const debouncedName = useDebounce(formInfo.name);
  const debouncedPhone = useDebounce(formInfo.phone);
  const handleChangeForm = async (e) => {
    const { name, value } = e.target;
    setFormInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    try {
      if (formRef.current) {
        await formRef.current.validate();
      }
      if (!payment || payment <= 0) {
        setError("Số tiền thu không hợp lệ");
        return;
      }
      if (config.allowOverpayment === false && payment > formInfo.debt) {
        setError("Số tiền thu không được vượt quá số tiền nợ");
        return;
      }
      setError("");
      // fullName, phone, address, email, payment_date, amount_received
      const data = {
        fullName: formInfo.name,
        phone: formInfo.phone,
        address: formInfo.address,
        email: formInfo.email,
        payment_date: new Date().toISOString().split("T")[0],
        amount_received: payment,
      };
      const res = await createPaymentReceipt(data);
      console.log(res);
      setFormInfo({
        name: "",
        phone: "",
        email: "",
        address: "",
        debt: 0,
      });
      setPayment(0);
      openModalAlert(true);
    } catch (err) {
      console.log(err);
      if (err.message === "Info error") {
        return;
      }
      openModalAlert(false);
    }
  };
  useEffect(() => {
    async function getCustomer() {
      try {
        const response = await getCustomerDB({
          params: {
            fullName: debouncedName,
            phone: debouncedPhone,
          },
        });
        setFormInfo({
          ...formInfo,
          email: response.email,
          address: response.address,
          debt: parseFloat(response.debt),
        });
        setError("");
      } catch (error) {
        console.log("err");
        if (debouncedName !== "" && debouncedPhone !== "") {
            setError("Không tìm thấy khách hàng!");
        }
        setFormInfo((prev) => ({
          ...prev,
          email: "",
          address: "",
          debt: 0,
        }));
      }
    }
    getCustomer();
  }, [debouncedName, debouncedPhone]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <FormInfoCustomer
          ref={formRef}
          formData={formInfo}
          onChange={handleChangeForm}
          className={styles["form-info"]}
        />
        <div className={styles["info-invoice"]}>
          <div className={styles["wrap-input"]}>
            <label htmlFor="collection-date">Ngày thu tiền:</label>
            <input
              type="date"
              id="collection-date"
              name="collection-date"
              title="Ngày thu tiền"
              value={new Date().toISOString().split("T")[0]}
              disabled
            />
          </div>
        
          <div className={`${styles["wrap-input"]} ${styles["input-money"]}`}>
            <label htmlFor="debt">Tiền nợ:</label>
            <input
              type="number"
              id="debt"
              name="debt"
              title="Tiền nợ"
              value={formInfo.debt}
              onChange={handleChangeForm}
              disabled
            />
          </div>
          <div className={`${styles["wrap-input"]} ${styles["input-money"]}`}>
          <label htmlFor="money-collected">Số tiền thu:</label>
          <input
            id="money-collected"
            name="money-collected"
            type="number"
            title="Số tiền thu"
            value={payment != null ? payment : 0}
            onChange={(e) => setPayment(e.target.value)}
          />
        </div>
        </div>
      </div>
      <div className={styles["wrap-btn"]}>
        <Button title="In phiéu" onClick={handleClick}>
          In phiếu
        </Button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
