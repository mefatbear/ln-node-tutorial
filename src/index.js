const express = require("express");
const LndGrpc = require("lnd-grpc");

const PORT = 4444;
const LND_CONNECT_URL = "CHANGE THIS";

const app = express();

if (LND_CONNECT_URL === "CHANGE THIS") {
  console.error("You need to edit the LND_CONNECT_URL const");
  process.exit(1);
}

const lndClient = new LndGrpc({
  lndconnectUri: LND_CONNECT_URL,
});

// Initialise LND Client
// This connects to the client and setups up a subscription to invoice events
async function initLndClient() {
  await lndClient.connect();

  const subscription = await lndClient.services.Lightning.subscribeInvoices();
  subscription.on("data", (invoice) => {
    console.log("Lightning Invoice Event");
    console.log(invoice);
  });
}
initLndClient();

app.use(express.json({ limit: "2mb" }));

app.get("/balance", async (_req, res) => {
  const balance = await lndClient.services.Lightning.walletBalance();
  return res.status(200).json(balance);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
