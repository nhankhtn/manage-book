import Link from "next/link";

import styles from "./Button.module.scss";


export default function Button({
  children,
  to,
  href,
  leftIcon,
  rightIcon,
  onClick,
  className,
  disabled,
  active,
  outline,
  alignTitle = "center",
  theme = "light",
  type,
  ...passProps
}) {
  let Comp = "button";
  const props = {
    onClick,
    ...passProps,
  };

  const classes = `${styles.wrapper} ${className} ${disabled ? styles.disabled : ""
    } ${active ? styles.active : ""} ${outline ? styles.outline : ""} 
    }`;

  if (href) {
    Comp = "a";
    props.href = href;
    props.target = "_blank";
  } else if (to) {
    Comp = Link;
    props.href = to;
  }

  return (
    <Comp className={classes} type={type} {...props}>
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      <span className={styles.title} style={{ textAlign: alignTitle }}>
        {children}
      </span>
      {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </Comp>
  );
}
