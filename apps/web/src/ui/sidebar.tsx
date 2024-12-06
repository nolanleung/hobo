import * as React from "react";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return <div {...props} ref={ref}>hi</div>;
});

Sidebar.displayName = "Sidebar";

export { Sidebar };
