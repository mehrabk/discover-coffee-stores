import React, { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
import cls from "classnames"

import styles from "../../styles/coffee-store.module.css"
import { fetchCoffeeStores } from "../../lib/coffee-stores"
import { StoreContext } from "../../store/store-context"
import { isEmpty } from "../../utils"

export async function getStaticPaths(props) {
  console.log("getStaticPaths = ", props)
  const coffeeStoresData = await fetchCoffeeStores()
  const paths = coffeeStoresData.map(coffeeStore => {
    return {
      params: {
        id: String(coffeeStore.id)
      }
    }
  })
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps(staticProps) {
  console.log("getStaticProps = ", staticProps)
  const { params } = staticProps
  const coffeeStoresData = await fetchCoffeeStores()

  return {
    props: {
      coffeeStore: coffeeStoresData.find(coffeeStore => Number(coffeeStore.id) === Number(params.id)) || {}
    }
  }
}

const CoffeeStore = props => {
  console.log("CoffeeStore Porops (SSG) = ", props)
  const router = useRouter()

  if (router.isFallback) {
    return <div>loading ...</div>
  }

  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore)
  const id = router.query.id
  const { state } = useContext(StoreContext)
  const { coffeeStores } = state

  useEffect(() => {
    if (isEmpty(props.coffeeStore)) {
      const result = coffeeStores.find(coffeeStore => Number(coffeeStore.id) === Number(id))
      setCoffeeStore(result)
    }
  }, [id])

  const { address, poi, info } = props.coffeeStore

  const handleUpvoteButton = () => {
    console.log("up vote...")
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{poi?.name || "test"}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href={"/"}>
              <a>⬅️Back to home</a>
            </Link>
          </div>

          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{poi?.name || "test"}</h1>
          </div>

          <Image
            src="/static/images/place.jpg"
            width={600}
            height={360}
            className={styles.storeImg}
            alt={poi?.name || "test"}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/location.svg" width={30} height={24} />
            <p className={styles.text}>{address?.municipality || "test"}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/pin.svg" width={30} height={24} />
            <p className={styles.text}>{info || "test"}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={30} height={24} />
            <p className={styles.text}>1</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up Vote
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore
