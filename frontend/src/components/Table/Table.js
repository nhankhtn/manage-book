import styles from "./Table.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faTrash } from "@fortawesome/free-solid-svg-icons";
export default function Table({ fieldCols, data, deleteRow }) {
  function handleClick(index) {
    deleteRow(index);
  }
  return (
    <table className={styles.container}>
      <thead className={styles.header}>
        <tr className={styles.row} >
          {fieldCols.map((column, index) => (
            <th key={index} className={`${styles.column} ${column.type === "button" ? styles.icon : ""}`}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className={styles["data_container"]}>
        {data.length ? data.map((row, indexRow) => (
          <tr key={indexRow} className={styles.row} >
            {
              fieldCols.map((col, indexCol) => (
                <td key={`${indexRow} ${indexCol}`} className={`${styles.column} ${col.type === "button" ? styles.icon : ""}`} >
                  {
                    col.type === "button" && col.name === "deleteBook" ?
                      <button
                        type="button"
                        title="Xoá"
                        className={styles["btn-trash"]}
                        onClick={() => { handleClick(index) }}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      : col.type === "input" ?
                        <div className={styles['wrap-input']}>
                          <input type="number" defaultValue={0} className={styles["input-field"]} />
                          <div className={styles['btn-up-down']}>
                            <button>
                              <FontAwesomeIcon icon={faChevronUp} />
                            </button>
                            <button>
                              <FontAwesomeIcon icon={faChevronDown} />
                            </button>
                          </div>
                        </div>
                        : row[col.name]
                  }
                </td>
              ))
            }
          </tr>
        )) : <tr className={styles.row}>
          <td colSpan={fieldCols.length + 1} className={styles.column}>Chưa có dữ liệu.</td>
        </tr>
        }
      </tbody>
    </table>
  );
}
