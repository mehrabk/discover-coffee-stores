import Head from "next/head"
import Image from "next/image"
import Banner from "../components/banner"
import Card from "../components/card"
import styles from "../styles/Home.module.css"
import { fetchCoffeeStores } from "../lib/coffee-stores"

import placeImage from "../public/static/images/place.jpg"
import useTrackLocation from "../hooks/use-track-location"

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores()
  return {
    props: {
      coffeeStores
    }
  }
}

export default function Home(props) {
  const { handleTrackLocation, latlong, locationErrorMsg, isFindingLoc } = useTrackLocation()

  console.log({ latlong, locationErrorMsg })

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
        <div className={styles.heroImage}>
          <Image src="/static/images/hero-image.png" width={700} height={400} />
        </div>
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
