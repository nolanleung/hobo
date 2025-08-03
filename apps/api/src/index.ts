import { auth, toNodeHandler } from "@repo/auth";
import { cors } from "@repo/middleware";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

app.listen(port, () => {
  console.log(`Hobo app listening on port ${port}`);
});
