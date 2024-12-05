import styles from "./TableBooksError.module.scss";

import { memo } from "react";


const TableBooksError= ({ fieldCols, data}) => {

  return (
    <table className={styles.container}>
      <thead className={styles.header}>
        <tr className={styles.row} >
          {fieldCols.map((column, index) => (
            <th key={index} >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length ? data.map((row, indexRow) => (
          <tr key={indexRow} className={styles.row} >
            {
              fieldCols.map((col, indexCol) => (
                <td key={`${indexRow} ${indexCol}`} >
                {row[col.name]}
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

export default memo(TableBooksError);