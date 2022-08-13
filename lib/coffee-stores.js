export const fetchCoffeeStores = async (coordinate = { lat: 35.752075, lon: 51.364958 }, limit = 6) => {
  const response = await fetch(
    `https://kr-api.tomtom.com/search/2/nearbySearch/.json?key=oWl6KCbgm4XFi9CILnAAlckHz0YcxN9f&lat=${coordinate.lat}&lon=${coordinate.lon}&limit=${limit}`
  )
  const { results } = await response.json()
  return results.map(item => ({
    id: item.id,
    name: item.poi.name,
    address: item.address.freeformAddress,
    neighbourhood: item.info || "",
    imgURL: "http://image.com",
    voting: 0
  }))
}
