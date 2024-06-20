import { connectDb } from "./db.js";
import { createServer } from "./server.js";

const server = createServer();
const port = 8000;

server.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    await connectDb();
  } catch (e) {
    process.exit(1);
  }
});

