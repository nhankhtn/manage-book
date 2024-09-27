import styles from "./Table.module.scss";
import { BOOK_FIELDS as columns } from "@/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
export default function Table({ data ,deleteRow}) {
  function handleClick(index) {
    deleteRow(index);
  }
  return (
    <>
      <table className={`${styles.header} ${styles.container}`}>
        <thead>
          <tr className={styles.row} >
            {columns.map((column, index) => (
              <th key={index} className={`${styles.column} ${styles.title}`}>
                {column}
              </th>
            ))}
            <th className={`${styles.column} ${styles.title} ${styles.icon}`} ></th>
          </tr>
        </thead>
        
      </table>

      <table className={`${styles.data_container} ${styles.container}`}>
        <tbody>
          {data.length ? data.map((row, index) => (
          <tr  key={index} className={styles.row} >
            <td className={styles.column}>{row.title}</td>
            <td className={styles.column}>{row.author}</td>
            <td className={styles.column}>{row.genre}</td>
            <td className={styles.column}>{row.quantity}</td>
            <td className={styles.column}>{row.price}</td>
            <td className={`${styles.column} ${styles.icon}`} >
              <button type="butotn" title="Xoá" className={styles["btn-trash"]} onClick={() => {handleClick(index)}}>
              <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
            
          </tr>
          )) : <tr className={styles.row}>
            <td colSpan={columns.length + 1} className={styles.column}>Chưa có dữ liệu.</td>
            </tr>
          }
        </tbody>
      
      </table>
    </>
    
      
  );
}
