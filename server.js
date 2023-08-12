const app = require("./app");

//handeling uncaugth exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error:${err.message}`);
//   console.log(`Shutt down server due to uncaugth exception`);
// });

require("dotenv").config();

//SERVER PORT
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`http://localhost:5000/`);
});

//Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutt down server for ${err.message}`);
  console.log(`Shutt down server due to Unhandled promise rejection`);
  //  serve close
  server.close(() => {
    process.exit(1);
  });
});
