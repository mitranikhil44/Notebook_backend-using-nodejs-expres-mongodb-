const connectToMongo = require("./db");
const express = require("express");
const cors = require('cors');

connectToMongo();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// Catch all handler for all other request.
// app.use('*', (req, res) => {
//   res.json({ msg: 'no route handler found' }).end()
// })

// Get a full listing
app.get('/', async (req, res) => {
  res.send("I - Notebook backed is now running");
})

app.listen(port, () => {
  console.log(`I - Notebook listening on port ${port}`);
});
