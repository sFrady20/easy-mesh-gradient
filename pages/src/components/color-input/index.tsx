import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import styles from "./style.module.css";

export const ColorInput = forwardRef<
  ElementRef<"div">,
  Omit<ComponentPropsWithoutRef<"input">, "type">
>((props, ref) => {
  const { className, style, ...inputProps } = props;

  return (
    <div ref={ref} style={style} className={`${styles.container} ${className}`}>
      <input {...inputProps} className={styles.input} type="color" />
    </div>
  );
});
