import { useState } from "react"

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("")
  const [coordinate, setCoordinate] = useState({})
  const [isFindingLoc, setIsFindingLoc] = useState(false)

  console.log("ajaba")

  const success = position => {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    console.log("lat", lat)
    setCoordinate({ lat, lon })
    setLocationErrorMsg("")
    setIsFindingLoc(false)
  }
  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location")
    setIsFindingLoc(false)
  }
  const handleTrackLocation = () => {
    setIsFindingLoc(true)
    if (!navigator.geolocation) {
      setLocationErrorMsg("GeoLocation is not supported by your browser")
    } else {
      navigator.geolocation.getCurrentPosition(success, error)
    }
  }

  return {
    coordinate,
    handleTrackLocation,
    locationErrorMsg,
    isFindingLoc
  }
}

export default useTrackLocation
