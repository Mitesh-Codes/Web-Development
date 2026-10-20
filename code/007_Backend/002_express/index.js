//require("dotenv").config();
import "dotenv/config";
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//     res.send('Welcome to the Tea Manager!');
// })
// app.get('/about', (req, res) => {
//     res.send('About Page');
// });
// app.get('/contact', (req, res) => {
//     res.send('Contact Page');
// });

app.use(express.json());

const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
        const logObject = {
            method: message.split(' ')[0],
            url: message.split(' ')[1],
            status: parseInt(message.split(' ')[2]),
            responseTime: parseInt(message.split(' ')[3]),
        };
        logger.info(JSON.stringify(logObject));
    }
  },
}));

let teaData = [];
let nextId = 1;

app.post("/tea", (req, res) => {
    logger.info("Received POST request to /tea");
    logger.warn("This is a warning message");
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

app.get("/tea", (req, res) => {
  res.status(200).send(teaData);
});

app.get("/tea/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not found");
  }
  res.status(200).send(tea);
});

app.put("/tea/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not found");
  }
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.send(200).send(tea);
});

app.delete("/tea/:id", (req, res) => {
  const index = teaData.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("tea not found");
  }
  teaData.splice(index, 1);
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
