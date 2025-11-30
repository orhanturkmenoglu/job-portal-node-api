const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal API",
      version: "1.0.0",
      description: "Node.js Job Portal API with Express",
    },
    servers: [
      {
        url: "http://localhost:5173/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"], // Swagger doc için taranacak dosyalar
};


const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;