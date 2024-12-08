import styles from "./Table.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { memo } from "react";


function Table({ fieldCols, data, updateRow = () => { }, deleteRow = () => { } }) {
  function handleClick(index) {
    deleteRow(index);
  }

  function handleInputChange(row, name, target) {
    if (target.type === "number") {
      if (target.value < 0) {
        target.value = 0;
      }

      updateRow(row, name, Number(target.value));
    }
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
                        onClick={() => { handleClick(indexRow) }}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      : col.type === "input" ?
                        <div className={styles['wrap-input']}>
                          <input type="number" value={row[col.name] || ''}
                            onChange={e => handleInputChange(row, col.name, e.target)}
                            className={styles["input-field"]} />
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
        )) : <tr className= {`${styles.column} ${styles.center}`} >
          <td colSpan={fieldCols.length + 1} className={styles.column}>Chưa có dữ liệu.</td>
        </tr>
        }
      </tbody>
    </table>
  );
}

export default memo(Table);