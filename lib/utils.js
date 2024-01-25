import axios from "axios"

export async function fetcher(url) {
  try {
    const options = {
      method: "GET",
      "Content-Type": "application/json",
    }
    const { data, status, headers, config, statusText, request } = await axios.get(url, options)

    if (status !== 200) throw new Error(statusText)

    return { data, status, headers, config, request }
  } catch (err) {
    console.error(err)
  }
}

export function getPublicationDate(text) {
  const match = text.match(/Publicado Dia: (\d{2}\/\d{2}\/\d{4})/)

  return match ? match[1] : null
}

export function sortedDate(date) {
  date.flat().sort((a, b) => {
    const dateA = new Date(a.date.split("/").reverse().join("-"))
    const dateB = new Date(b.date.split("/").reverse().join("-"))

    return dateB - dateA
  })

  return date
}
