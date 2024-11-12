
import styles from "./FormInfoBook.module.scss"

export default function FormInfoBook({ formData, onChange, className }) {
    return <div className={`${styles.wrapper} ${className}`}>
        <h2 className={styles.heading}>Thông tin sách</h2>
        <div className={styles["row-item"]}>
            <div className={styles["form-item"]}>
                <label htmlFor="name">Tên sách</label>
                <input type="text" name="title" id="title" title="Tên sách" value={formData.title} onChange={onChange} />
            </div>
            <div className={styles["form-item"]}>
                <label htmlFor="phone">Tên tác giả</label>
                <input type="text" name="author" id="author" title="Tên tác giả" value={formData.author} onChange={onChange} />
            </div>
        </div>
        <div className={styles["row-item"]}>
            <div className={styles["form-item"]}>
                <label htmlFor="name">Thể loại</label>
                <input type="text" name="category" id="category" title="Thể loại" value={formData.category} onChange={onChange} />
            </div>
            <div className={styles["form-item"]}>
                <label htmlFor="phone">Đơn giá</label>
                <input type="text" name="price" id="price" title="Đơn giá" value={formData.price} onChange={onChange} />
            </div>
        </div>
    </div>
}