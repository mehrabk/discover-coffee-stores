import { useState } from "react"

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("")
  const [latlong, setLatlong] = useState("")
  const [isFindingLoc, setIsFindingLoc] = useState(false)

  const success = position => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    setLatlong(`${latitude},${longitude}`)
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
    latlong,
    handleTrackLocation,
    locationErrorMsg,
    isFindingLoc
  }
}

export default useTrackLocation
