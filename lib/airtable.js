const Airtable = require("airtable")
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY
})
const base = Airtable.base("appPaJakdIUNF42sN")
const table = base("coffee-stores")

const getMinifiedRecord = record => {
  return Object.assign({ recordId: record.id }, record.fields)
}

export const getMinifiedRecords = records => {
  return records.map(record => getMinifiedRecord(record))
}

export const findRecordByFilter = async id => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id=${id}`
    })
    .firstPage()
  return getMinifiedRecords(findCoffeeStoreRecords)
}

export default table
