import Head from "next/head"
import Image from "next/image"
import Banner from "../components/banner"
import Card from "../components/card"
import styles from "../styles/Home.module.css"
import coffeeStoresData from "../data/coffee-stores.json"

export async function getStaticProps() {
  return {
    props: {
      coffeeStores: coffeeStoresData
    }
  }
}

export default function Home(props) {
  const handleOnButtonClick = () => {
    console.log("hi banner button")
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner buttonText="View stores nearby" handleClick={handleOnButtonClick} />
        <div className={styles.heroImage}>
          <Image src="/static/images/hero-image.png" width={700} height={400} />
        </div>
        {props.coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map(coffeeStore => {
                return (
                  <Card
                    key={coffeeStore.id}
                    href={`/coffee-store/${coffeeStore.id}`}
                    imgUrl={coffeeStore.imgUrl}
                    name={coffeeStore.name}
                  />
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
