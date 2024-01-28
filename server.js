import express from "express"
import cors from "cors"
import { getEpisodeInfo, searchAnime } from "./lib/index.js"
import { fetcher } from "./lib/utils.js"
import myList from "./animes.json" assert { type: "json" }

const app = express()
const port = process.env.PORT || 5050

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("json spaces", 2)

app.get("/", (req, res) => {
  return res.status(200).json({ endpoints: "/anime", animesAvaliable: myList })
})

app.get("/anime/search", async (req, res) => {
  const query = req.query.q

  if (!query) return res.status(400).json({ message: "Query not provided" })

  try {
    const result = await searchAnime(query)

    if (!result.length) return res.status(404).json({ message: "Anime not found" })

    return res.status(200).json({ result })
  } catch (err) {
    console.error(err)
  }
})

app.get("/anime/:anime", async (req, res) => {
  const anime = req.params.anime

  if (!anime || anime === "") return res.status(400).json({ message: "Anime not provided" })

  try {
    const { data, ...response } = await getEpisodeInfo(anime)

    // if (!data || !Array.isArray(data) || data.length === 0) {
    //   return res.status(404).json({ message: "No data found for this anime" })
    // }

    // if (!response || !response.data) {
    //   console.error(`No data returned for episode: ${item.episode}`)

    //   return null
    // }

    const result = await data.map(async item => {
      const request = await fetcher(item.episode)

      if (!request) return null

      return request
    })

    // const filteredResult = result.filter(item => item !== null)

    return res.status(200).json({ response, result: result[0] })
  } catch (err) {
    console.error(err)
    return res.status(404).json({ message: "Anime not found" })
  }
})

app.use((req, res) => {
  return res.status(404).json({ message: "Page not found" })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
