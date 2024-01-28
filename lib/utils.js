import axios from "axios"
import fs from "fs"

export async function fetcher(url) {
  try {
    const options = {
      method: "GET",
      "Content-Type": "application/json",
    }
    const { data, status, headers, config, statusText, request } = await axios.get(url, options)

    if (status !== 200) return // throw new Error(statusText)

    return { data, status, headers, config, request }
  } catch (err) {
    return
  }
}

export function getPublicationDate(text) {
  const match = text.match(/Publicado Dia: (\d{2}\/\d{2}\/\d{4})/)

  return match ? match[1] : null
}

export function getEpisodeNumber(text) {
  const match = text.match(/Episódio (\d+)/)

  return match ? match[1] : null
}

export function sortedDate(date) {
  date.sort((a, b) => {
    const dateA = new Date(a.date.split("/").reverse().join("-"))
    const dateB = new Date(b.date.split("/").reverse().join("-"))

    return dateB - dateA
  })

  return date
}

export function replaceSpacesWithHyphens(str) {
  return str.replace(/\s+/g, "-").toLowerCase()
}

export function readJsonFile(filePath) {
  try {
    const json = fs.readFileSync(filePath, "utf-8")
    const jsonFormat = JSON.parse(json)

    return jsonFormat
  } catch (err) {
    console.error(err)
  }
}

export function filterEpisodes(data) {
  // if (!data.episodes) console.info("Episodes not found")

  return data.filter(episode => episode.date && episode.episode)
}
