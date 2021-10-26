const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oitvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const dataBase = client.db("car-mechanic");
    const servicesCollection = dataBase.collection("services");
    // get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    // get all data
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // post api
    app.post("/services", async (req, res) => {
      console.log("hit the post api");
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // console.log("connected to database");
    //   const database = client.db("insertDB");
    //   const haiku = database.collection("haiku");
    // create a document to insert
    //   const doc = {
    //     title: "Record of a Shriveled Datum",
    //     content: "No bytes, no problem. Just insert a document, in MongoDB",
    //   }
    //   const result = await haiku.insertOne(doc);
    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running ginus server");
});
app.get("/hello", async (req, res) => {
  res.send("hola kuku");
});
app.listen(port, () => {
  console.log("listing on port: ", port);
});
/* one time */
// 1. heroku account open
// 2. software install
// 3. git init
// 4. git ignore(node_modules,.env)
// 5. push everything to git
// 6. make sure start script in package.json
// 7. process.env.PORT || 5000;
// 8. heroku login
// 9. heroku create for each project one time
// 10. git push heroku main
// 11. git add. git commit -m "something"
