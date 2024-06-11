const swaggerAutogen = require("swagger-autogen")({
  opeanapi: "3.0.0",
  autoHeaders: false,
});

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:5000",
};

const outputFile = "./docs/swagger-output.json";
const routes = [
  "./src/router/auth.ts",
  "./src/router/me.ts",
  "./src/router/replies.ts",
  "./src/router/thread.ts",
  "./src/router/user.ts",
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
