import { useContext } from "react"
import Head from "next/head"
import Image from "next/image"
import Banner from "../components/banner"
import Card from "../components/card"
import styles from "../styles/Home.module.css"
import { fetchCoffeeStores } from "../lib/coffee-stores"

import placeImage from "../public/static/images/place.jpg"
import useTrackLocation from "../hooks/use-track-location"
import { useEffect, useState } from "react"
import { StoreContext, ACTION_TYPES } from "../store/store-context"

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores()
  return {
    props: {
      coffeeStores
    }
  }
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLoc } = useTrackLocation()
  // const [coffeeStores, setCoffeeStores] = useState([])
  const { state, dispatch } = useContext(StoreContext)
  const { coordinate, coffeeStores } = state
  const [coffeeStoresError, setCoffeeStoresError] = useState(null)

  // fetch data from client (CSR)
  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/getCoffeeStoresByLocation?lat=${coordinate.lat}&lon=${coordinate.lon}&limit=30`
      )
      const fetchResult = await response.json()
      console.log(fetchResult)

      dispatch({
        type: ACTION_TYPES.SET_COFFEE_STORES,
        payload: fetchResult
      })
    } catch (error) {
      console.log(error)
      setCoffeeStoresError(error.message)
    }
  }
  useEffect(() => {
    if (coordinate?.lat) {
      fetchData()
    }
  }, [coordinate])
  console.log({ coordinate, locationErrorMsg })

  const handleOnButtonClick = () => {
    console.log("hi banner button")
    handleTrackLocation()
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="discover nearby places"></meta>
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLoc ? "Locating" : "View stores nearby"}
          handleClick={handleOnButtonClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Coffee Stores Fetching Error: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/images/hero-image.png" width="700" height="400" alt="hero-image" />
        </div>
        {/*Client Side Rendering(CSR)*/}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(coffeeStore => {
                return (
                  <Card
                    key={coffeeStore.id}
                    href={`/coffee-store/${coffeeStore.id}`}
                    imgUrl={coffeeStore.imgUrl || placeImage}
                    name={coffeeStore.name}
                  />
                )
              })}
            </div>
          </div>
        )}
        {/*Static Site Generation(SSG)*/}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map(coffeeStore => {
                return (
                  <Card
                    key={coffeeStore.id}
                    href={`/coffee-store/${coffeeStore.id}`}
                    imgUrl={coffeeStore.imgUrl || placeImage}
                    name={coffeeStore.name}
                  />
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
