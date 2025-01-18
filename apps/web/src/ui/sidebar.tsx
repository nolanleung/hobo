import * as React from "react";
import { cn } from "@repo/ui";

import "./sidebar.css";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return <div {...props} className={cn("sidebar")} ref={ref} />;
});

Sidebar.displayName = "Sidebar";

export { Sidebar };
