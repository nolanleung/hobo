import "dotenv/config";

import { serve } from "@hono/node-server";
import { app } from "./server";

const port = process.env.PORT || 8080;

serve(
  {
    fetch: app.fetch,
    port: Number(port),
  },
  () => {
    console.log(`API listening on port ${port}`);
  }
);
