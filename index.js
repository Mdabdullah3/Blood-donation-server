const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
const jwt = require("jsonwebtoken");
app.use(cors());
// Database connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://AbiAbdullah:pUsZrMZS342Awr5D@cluster0.nspmanz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const DataCollection = client.db("BloodAi").collection("UserData");
    const BloodReqestCollection = client.db("BloodAi").collection("BloodReq")
    const DonarCollection = client.db("BloodAi").collection('Donar')


    // All User Data
    app.get("/user", async (req, res) => {
      const query = req.body;
      const data = await DataCollection.find(query).toArray();
      res.send(data);
    });

    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user
      };
      const result = await DataCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    });

    app.put("/user/update/:email", async (req, res) => {
      const email = req.params.email;
      const userInfo = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateUser = {
        $set: userInfo,
      };
      const result = await DataCollection.updateOne(
        filter,
        updateUser,
        options
      );
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const users = await DataCollection.findOne(query);
      res.send(users);
    });

    // Donar Api 
    app.get("/donar", async (req, res) => {
      const query = req.body;
      const donar = await DonarCollection.find(query).toArray()
      res.send(donar)
    })

    app.get("/myDonar", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = DonarCollection.find(query);
      const result = await cursor.toArray();
      return res.send(result);
    });

    app.post("/donar", async (req, res) => {
      const query = req.body;
      const donarPost = await DonarCollection.insertOne(query);
      res.send(donarPost);
    })

    // Blood Request Collection 
    app.get("/bloodReq", async (req, res) => {
      const query = req.body
      const data = await BloodReqestCollection.find(query).toArray()
      res.send(data)
    })

    app.post("/bloodReq", async (req, res) => {
      const query = req.body;
      const bloodPost = await BloodReqestCollection.insertOne(query);
      res.send(bloodPost);
    })

    app.get("/myRequest", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = BloodReqestCollection.find(query);
      const result = await cursor.toArray();
      return res.send(result);
    });

    app.delete("/bloodReq/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deleteReq = await BloodReqestCollection.deleteOne(query);
      res.send(deleteReq);
    })

  } finally {
  }
}

run().catch;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
