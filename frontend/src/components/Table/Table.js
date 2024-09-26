import styles from "./Table.module.scss";
import { IMPORT_COLUMNS as columns } from "@/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
export default function Table({ data ,Delete}) {
  function handleClick(index) {
    Delete(index);
  }
  return (
    <div className={styles.container}>
      <div className={styles.row} >
        {columns.map((column, index) => (
          <div key={index} className={`${styles.column} ${styles.title}`}>
            {column}
          </div>
        ))}
        <div className={`${styles.column} ${styles.title} ${styles.icon}`} ></div>
      </div>
      <div className={styles.data_container}>
        {data.length!=0 ? data.map((row, index) => (
          <div key={index} className={styles.row} >
            <div className={styles.column}>{row.title}</div>
            <div className={styles.column}>{row.author}</div>
            <div className={styles.column}>{row.genre}</div>
            <div className={styles.column}>{row.quantity}</div>
            <div className={styles.column}>{row.price}</div>
            <div className={`${styles.column} ${styles.icon}`} onClick={() => {handleClick(index)}}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
            
          </div>
        )) : <div className={styles.row}>
          <div className={styles.column}>Chưa có dữ liệu.</div>
          </div>
        }
      </div>
      
    </div>
  );
}