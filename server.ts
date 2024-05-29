import app from "./app";
import { AppDataSource } from "./src/libs/dataSource";
import { getEnv } from "./src/libs/env";

const PORT = getEnv("PORT");

async function main() {
  try {
    const dataSource = await AppDataSource.initialize();
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
    console.log("Error connecting to database with typeorm");
  }
}

main();
