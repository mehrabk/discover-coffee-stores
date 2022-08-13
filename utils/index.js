export const isEmpty = obj => typeof obj === "object" && Object.keys(obj).length === 0
export const fetcher = (...args) => fetch(...args).then(res => res.json())
