const Airtable = require("airtable")
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY
})
const base = Airtable.base("appPaJakdIUNF42sN")
const table = base("coffee-stores")

export default table
