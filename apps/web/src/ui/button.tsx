import * as React from "react";

import styles from "./button.module.css";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return <button {...props} className={styles.button} ref={ref} />;
});

Button.displayName = "Button";

export { Button };
