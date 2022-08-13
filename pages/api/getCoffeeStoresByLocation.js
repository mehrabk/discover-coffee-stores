import { fetchCoffeeStores } from "../../lib/coffee-stores"

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { lon, lat, limit } = req.query
    const fetchResult = await fetchCoffeeStores({ lon, lat }, limit)
    return res.status(200).json(fetchResult)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export default getCoffeeStoresByLocation
