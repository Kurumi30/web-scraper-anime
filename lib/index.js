import { load } from 'cheerio'
import { cleanTitle, fetcher } from './utils.js'

const anime = "akuyaku-reijou-level-99-watashi-wa-ura-boss-desu-ga-maou-dewa-arimasen/"
const animeUrl = `https://saikoanimes.net/anime/`
const url = `${animeUrl}${anime}`

async function requestData() {
  const { data } = await fetcher(url)
  const $ = load(data)
  const links = []

  const description = $(".sinopse-content").text()
  const animeTitle = $(".title-ani").text()
  const englishTitle = $(".subtitle-ani").text()
  const genres = []

  $(".genres").find(".bnt-genero").each((i, el) => {
    genres.push($(el).text())

    return genres
  })

  $("a").each((i, el) => {
    const link = $(el).attr("href")

    if (link.includes("https://saikoanimes.net/baixarr?=")) links.push(link)
  })

  return { link: links[0], animeTitle, englishTitle, genres, description }
}

export async function accessDownloadPage() {
  const { link, description, animeTitle, englishTitle, genres } = await requestData()
  const { data } = await fetcher(link)
  const $ = load(data)
  const response = []

  $("nav").each((i, el) => {
    const title = $(el).find(".tumbup1").text()
    const size = $(el).find(".tumbup").eq(0).text()
    const date = $(el).find(".tumbup").eq(1).text()
    const dataUrl = $(el).attr("data-url")

    if (dataUrl.includes("https://")) {
      return response.push({
        episode: cleanTitle(title),
        size,
        date,
        download: dataUrl,
      })
    }

    return response
  })

  // console.log({ titulo: animeTitle, description, genres, response })

  return { japaneseTitle: animeTitle, englishTitle, description, genres, response }
}
