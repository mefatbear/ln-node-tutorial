const express = require("express");
const LndGrpc = require("lnd-grpc");

const PORT = 4444;
const LND_CONNECT_URL =
  "lndconnect://127.0.0.1:10001?cert=MIICKDCCAc2gAwIBAgIRALaZUgZ_-nijlq03knLYTF8wCgYIKoZIzj0EAwIwMTEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEOMAwGA1UEAxMFYWxpY2UwHhcNMjEwOTI0MDM0NzMxWhcNMjIxMTE5MDM0NzMxWjAxMR8wHQYDVQQKExZsbmQgYXV0b2dlbmVyYXRlZCBjZXJ0MQ4wDAYDVQQDEwVhbGljZTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABPa15TtA8zwKAAhC8MydDKp1yDFQuf-UgZY3HlIhRB0A2p9Qx_SH08r4oSY0vbIM64nsqA9mX9jGlbP-P3aeVx6jgcUwgcIwDgYDVR0PAQH_BAQDAgKkMBMGA1UdJQQMMAoGCCsGAQUFBwMBMA8GA1UdEwEB_wQFMAMBAf8wHQYDVR0OBBYEFOG5Q2fbsqKX_e8vo6lVfI-1BWezMGsGA1UdEQRkMGKCBWFsaWNlgglsb2NhbGhvc3SCBWFsaWNlgg5wb2xhci1uMi1hbGljZYIEdW5peIIKdW5peHBhY2tldIIHYnVmY29ubocEfwAAAYcQAAAAAAAAAAAAAAAAAAAAAYcErBIAAzAKBggqhkjOPQQDAgNJADBGAiEA8HUc83vw79AkgWS5477sCjuDkLSxa_LkMfBy5kWH9coCIQCTl3r6NAIytbQqV2zzQbJxKUUxMRfgrLsdX19cuklD5g&macaroon=AgEDbG5kAvgBAwoQWbgd1P7mrssZkgkto0PsfBIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYgyKWs-TLgyekUVQaFL2zktwdhWFJYJX0nugpZoP-rQD8";

const app = express();

if (LND_CONNECT_URL === "CHANGE THIS") {
  console.error("You need to edit the LND_CONNECT_URL const");
  process.exit(1);
}

const lndClient = new LndGrpc({
  lndconnectUri: LND_CONNECT_URL,
});

async function initLndClient() {
  await lndClient.connect();

  const subscription = await lndClient.services.Lightning.subscribeInvoices();
  subscription.on('data', (invoice) => {
    console.log('Lightning Invoice Event');
    console.log(invoice);
  });
}
initLndClient();

app.use(express.json({ limit: "2mb" }));

app.get("/balance", async (_req, res) => {
  console.log(lndClient.services.Lightning);
  const balance = await lndClient.services.Lightning.walletBalance();
  return res.status(200).json(balance);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

