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
  type = "button",
  ...passProps
}) {
  let Comp = "button";
  const props = {
    onClick,
    ...passProps,
  };

  if (disabled) {
    // delete props.onClick;
    Object.keys(props).forEach((key) => {
        if (key.startsWith('on') && typeof props[key] === 'function') {
            delete props[key];
        }
    });
  }

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
      <span className={styles.title} >
        {children}
      </span>
      {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </Comp>
  );
}
