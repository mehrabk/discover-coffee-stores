import Head from "next/head"
import Image from "next/image"
import Banner from "../components/banner"
import Card from "../components/card"
import styles from "../styles/Home.module.css"
import { fetchCoffeeStores } from "../lib/coffee-stores"

import placeImage from "../public/static/images/place.jpg"
import useTrackLocation from "../hooks/use-track-location"
import { useEffect, useState } from "react"

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores()
  return {
    props: {
      coffeeStores
    }
  }
}

export default function Home(props) {
  const { handleTrackLocation, coordinate, locationErrorMsg, isFindingLoc } = useTrackLocation()
  const [coffeeStores, setCoffeeStores] = useState([])
  const [coffeeStoresError, setCoffeeStoresError] = useState(null)
  const fetchData = async () => {
    try {
      const fetchResult = await fetchCoffeeStores(coordinate, 30) // CSR
      setCoffeeStores(fetchResult)
    } catch (error) {
      console.log(error)
      setCoffeeStoresError(error.message)
    }
  }
  useEffect(() => {
    if (Object.keys(coordinate).length > 0) {
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
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLoc ? "Locating" : "View stores nearby"}
          handleClick={handleOnButtonClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Coffee Stores Fetching Error: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/images/hero-image.png" width={700} height={400} />
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
                    name={coffeeStore.poi.name}
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
                    name={coffeeStore.poi.name}
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
