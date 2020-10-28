const keys = require("./keys");

// Express App Setup
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Postgres client setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  password: keys.pgPassword,
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase,
});

pgClient.on("error", () => {
  console.log("Lost PG connection");
});

pgClient
  .query("CREATE TABLE IF NOT EXISTS values(number int)")
  .catch((error) => console.log(error));

// Redis client setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  try {
    const values = await pgClient.query("SELECT * FROM values");
    res.send(values.rows);
  } catch (err) {
    console.log(err);
  }
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    if (err) return res.status(500).send("Server error", err);
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  try {
    const index = req.body.index;
    if (parseInt(index) > 40) return res.status(422).send("Index cannot be greater than 40.");

    redisClient.hset("values", index, "Nothing yet!");
    redisPublisher.publish("insert", index);

    await pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

    res.send({ working: true });
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, (err) => {
  console.log("Listening");
});
