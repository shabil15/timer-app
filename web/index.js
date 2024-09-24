
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import dotenv from 'dotenv';
dotenv.config();

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import mongoose from "mongoose";
import Timer from "./Models/Timer.js";

mongoose.connect("mongodb+srv://mohammedshabil15:rYhyMCicvf8Xas9A@cluster0.0bxck.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
  console.log('Connected to MongoDB');
})
.catch((error)=>{
  console.log('Error connecting to MongoDB:', error);
});

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot(),async (req, res) => {
    const session = res.locals.shopify.session;
    const shop = session.shop; // Shopify store domain
  
    // You can use the shop domain here to save in your database
    console.log('Shop domain:', shop);
  }
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get('/api/shop', (req, res) => {
  const session = res.locals.shopify.session;
  const shop = session.shop; 
  res.status(200).send({ shop });
});

app.post("/api/timers", async (req, res) => {
  const { startDateTime, endDateTime, shop } = req.body; 

  try {
    const timer = new Timer({
      startDateTime,
      endDateTime,
      shop, 
    });

    await timer.save();
    res.status(201).send({ message: 'Timer created successfully!', timer });
  } catch (error) {
    console.error(`Failed to create timer: ${error.message}`);
    res.status(500).send({ error: 'Failed to create timer' });
  }
});

app.get("/api/timers", async (req, res) => {
  try {
    const shop = res.locals.shopify.session.shop; 
    const timers = await Timer.find({ shop }); 

    res.status(200).json(timers); 
  } catch (error) {
    console.error("Failed to fetch timers:", error);
    res.status(500).json({ error: "Failed to fetch timers" });
  }
});


app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
