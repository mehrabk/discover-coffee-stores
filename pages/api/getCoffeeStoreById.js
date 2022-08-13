import React from "react"
import table, { findRecordByFilter } from "../../lib/airtable"

async function getCoffeeStoreById(req, res) {
  const { id } = req.query

  try {
    if (id) {
      const records = await findRecordByFilter(id)
      if (records.length !== 0) {
        res.json(records)
      } else {
        res.json({ message: "id could not be found " })
      }
    } else {
      res.status(400).json({
        message: "id is missing"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error
    })
  }
  return <div>getCoffeeStoreById</div>
}

export default getCoffeeStoreById
