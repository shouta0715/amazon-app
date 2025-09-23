import { factory } from "./app";
import { articlesApp } from "./routes/articles";
import { ordersApp } from "./routes/orders";
import { webhooksApp } from "./routes/webhooks";

const app = factory.createApp();

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/articles", articlesApp);
app.route("/orders", ordersApp);
app.route("/webhooks", webhooksApp);

export default app;
