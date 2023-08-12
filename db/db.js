const { default: mongoose } = require("mongoose");

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB Connected SuccsesFull");
  })
  .catch((err) => {
    console.log("DB Connect Fail");
  });
