const Airtable = require("airtable")
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY
})
const base = Airtable.base("appPaJakdIUNF42sN")

const table = base("coffee-stores")

console.log(table)

const createCoffeeStore = async (req, res) => {
  try {
    if (req.method === "POST") {
      // find record
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id="4"`
        })
        .firstPage()

      if (findCoffeeStoreRecords.length !== 0) {
        const records = findCoffeeStoreRecords.map(record => record.fields)
        res.json(records)
      } else {
        // create record
        const createRecords = await table.create([
          {
            fields: {
              id: "4",
              name: "Chenar",
              address: "Abazar Street",
              neighbourhood: "Fani Herfeie",
              voting: 13,
              imgURL: "http://myImage.com"
            }
          }
        ])
        const records = createRecords.map(record => record.fields)
        res.json({ message: "created", records })
      }
    }
    res.json({ message: "hi there" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error finding store" })
  }
}

export default createCoffeeStore
