import table from "../../lib/airtable"

const createCoffeeStore = async (req, res) => {
  try {
    if (req.method === "POST") {
      // find record
      const { id, name, address, neighbourhood, voting, imgURL } = req.body
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id=${id}`
        })
        .firstPage()

      if (findCoffeeStoreRecords.length !== 0) {
        const records = findCoffeeStoreRecords.map(record => record.fields)
        return res.json(records)
      } else {
        // create record
        const createRecords = await table.create([
          {
            fields: { id, name, address, neighbourhood, voting, imgURL }
          }
        ])
        const records = createRecords.map(record => record.fields)
        return res.json({ message: "created", records })
      }
    }
    return res.json({ message: "hi there" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error finding store", error })
  }
}

export default createCoffeeStore
