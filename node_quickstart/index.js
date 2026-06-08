console.log("Script started");

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://Kahindi:db_Sidi2005@cluster0-shard-00-00.7qikfkj.mongodb.net:27017,cluster0-shard-00-01.7qikfkj.mongodb.net:27017,cluster0-shard-00-02.7qikfkj.mongodb.net:27017/?replicaSet=atlas-...&authSource=admin&retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
