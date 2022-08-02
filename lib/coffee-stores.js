export const fetchCoffeeStores = async () => {
  const response = await fetch(
    `${process.env.TOMTOM_BASE_URL}/search/2/nearbySearch/.json?key=${process.env.TOMTOM_CLIENT_KEY}&lat=35.752075&lon=51.364958&limit=5`
  )

  const { results } = await response.json()
  return results
}
