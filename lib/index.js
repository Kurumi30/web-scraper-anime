import { load } from "cheerio"
import { fetcher, getEpisodeNumber, getPublicationDate, replaceSpacesWithHyphens, sortedDate } from "./utils.js"

const animeUrl = "https://animefire.plus/animes/"
const allEpisodes = "-todos-os-episodios"

async function requestData(name) {
  const url = `${animeUrl}${name}${allEpisodes}`

  try {
    const { data } = await fetcher(url)

    if (!data) return { message: "Anime not found" }

    const $ = load(data)
    const links = []

    const description = $(".divSinopse > .spanAnimeInfo").text()
    const animeTitle = $(".div_anime_names > .quicksand400").text()
    const englishTitle = $(".div_anime_names > h6").eq(0).text()
    const studio = $(".animeInfo > span").eq(1).text()
    const type = $(".animeInfo > span").eq(2).text()
    const imageUrl = $(".sub_animepage_img > img").attr("data-src")

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

    return { links, animeTitle, englishTitle, studio, description, type, imageUrl }
  } catch (err) {
    return
  }
}

export async function searchAnime(query) {
  const params = replaceSpacesWithHyphens(query)
  const url = `https://animefire.plus/pesquisar/${params}`

  const { data } = await fetcher(url)
  const $ = load(data)
  const animesResults = []

  $(".divCardUltimosEps").each((i, el) => {
    const animeName = $(el).find(".imgAnimes").attr("alt")
    const thumbnail = $(el).find(".imgAnimes").attr("data-src")
    const animeLink = $(el).find("a").attr("href")

    return animesResults.push({
      animeName,
      thumbnail,
      animeLink,
    })
  })

  return animesResults
}

export async function getEpisodeInfo(anime) {
  const res = await requestData(anime)
  const response = []

  if (!res || !res.links) return null // { message: "Anime not found" }

  const { links, ...args } = res
  const data = await Promise.all(links.map(async link => {
    const { data } = await fetcher(link)
    const $ = load(data)

    let episodeName = $(".sectionVideoEpTitle").text()
    let responseEpisode = $("video").attr("data-video-src")
    let publicationDate = $("li > h6").text()

    response.push({
      episodeNumber: getEpisodeNumber(episodeName),
      episode: responseEpisode,
      date: getPublicationDate(publicationDate),
    })

    return response
  })) // .flat()
  
  const uniqueData = Array.from(new Set(data.map(JSON.stringify))).map(JSON.parse)

  // console.info({ result: args, data: sortedDate(uniqueData[0]) })
  return { result: args, data: sortedDate(uniqueData[0]) }
}
