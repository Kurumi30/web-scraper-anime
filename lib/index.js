import { load } from "cheerio"
import { fetcher, getPublicationDate, sortedDate } from "./utils.js"

async function requestData(name) {
  const animeUrl = "https://animefire.plus/animes/"
  const allEpisodes = "-todos-os-episodios"
  const url = `${animeUrl}${name}${allEpisodes}`

  try {
    const { data } = await fetcher(url)

    if (!data) return { message: "Anime not found" }

    const $ = load(data)
    const links = []

    const description = $(".divSinopse > .spanAnimeInfo").text()
    const animeTitle = $(".div_anime_names > .quicksand400").text()
    const englishTitle = $(".div_anime_names > h6").eq(0).text()
    const type = $(".animeInfo > span").eq(2).text()

    // const genres = []

    // $(".genres").find(".bnt-genero").each((i, el) => {
    //   genres.push($(el).text())

    //   return genres
    // })

    $("a").each((i, el) => {
      const link = $(el).attr("href")

      if (!link.includes(`${animeUrl}${name}`) || link.includes(allEpisodes)) return

      return links.push(link)
    })

    return { links, animeTitle, englishTitle, description, type }
  } catch (err) {
    console.error(err)
  }
}

export async function getEpisodeInfo(anime) {
  const { links, description, animeTitle, englishTitle, type } = await requestData(anime)
  const response = []
  const data = await Promise.all(links.map(async link => {
    const { data } = await fetcher(link)
    const $ = load(data)

    let responseEpisode = $("video").attr("data-video-src")
    let publicationDate = $("li > h6").text()

    response.push({
      episode: responseEpisode,
      date: getPublicationDate(publicationDate),
    })

    return response
  }))
  const uniqueData = Array.from(new Set(data.map(JSON.stringify))).map(JSON.parse)

  return { animeTitle, englishTitle, description, type, data: sortedDate(uniqueData) }
}
