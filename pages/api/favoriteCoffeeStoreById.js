import table, { findRecordByFilter, getMinifiedRecords } from "../../lib/airtable"

//upVoting count
async function favoriteCoffeeStoreById(req, res) {
  if (req.method === "PUT") {
    try {
      const { id } = req.body
      if (id) {
        const records = await findRecordByFilter(id)
        if (records.length !== 0) {
          const record = records[0]
          const calculateVoting = parseInt(record.voting) + 1
          // update record
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting
              }
            }
          ])

          if (updateRecord) {
            const minifiedRecord = getMinifiedRecords(updateRecord)
            return res.json(minifiedRecord)
          }

          return res.json(records)
        } else {
          return res.status(400).json({ message: "CoffeeStore id doesn`t exist" })
        }
      } else {
        return res.status(400).json({
          message: "id is missing"
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Error upVoting coffeeStore" })
    }
  }
}

export default favoriteCoffeeStoreById
