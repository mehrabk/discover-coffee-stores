import table, { findRecordByFilter } from "../../lib/airtable"

const createCoffeeStore = async (req, res) => {
  try {
    if (req.method === "POST") {
      // find&get record
      const { id, name, address, neighbourhood, voting, imgURL } = req.body

      const records = await findRecordByFilter(id)
      if (records.length !== 0) {
        res.json(records)
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
