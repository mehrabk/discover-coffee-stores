const Airtable = require("airtable")
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY
})
const base = Airtable.base("appPaJakdIUNF42sN")
const table = base("coffee-stores")

export const findRecordByFilter = async id => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id=${id}`
    })
    .firstPage()

  return findCoffeeStoreRecords.map(record => record.fields)
}

export default table
