import { findRecordByFilter } from "../../lib/airtable"

async function getCoffeeStoreById(req, res) {
  const { id } = req.query
  try {
    if (id) {
      const records = await findRecordByFilter(id)
      if (records.length !== 0) {
        return res.json(records)
      } else {
        return res.json({ message: "id could not be found " })
      }
    } else {
      return res.status(400).json({
        message: "id is missing"
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error
    })
  }
}

export default getCoffeeStoreById
