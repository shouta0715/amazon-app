import { Hono } from "hono";
import { articlesRouter } from "./routes/articles";
import { ordersRouter } from "./routes/orders";
import { webhooksRouter } from "./routes/webhooks";

const app = new Hono();
// app.use("*", clerkMiddleware());

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/articles", articlesRouter);
app.route("/orders", ordersRouter);
app.route("/webhooks", webhooksRouter);

export default app;
