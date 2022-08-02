import React, { useReducer } from "react"
import "../styles/globals.css"

export const ACTION_TYPES = {
  SET_COORDINATE: "SET_COORDINATE",
  SET_COFFEE_STORES: "SET_COFFEE_STORES"
}

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_COORDINATE: {
      return { ...state, coordinate: action.payload }
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      return { ...state, coffeeStores: action.payload }
    }

    default: {
      throw new Error("Unhandled Action Type")
    }
  }
}

export const StoreContext = React.createContext()

const StoreProvider = ({ children }) => {
  const initalState = {
    coordinate: { lat: "", lon: "" },
    coffeeStores: []
  }

  const [state, dispatch] = useReducer(storeReducer, initalState)
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  )
}

export default MyApp
