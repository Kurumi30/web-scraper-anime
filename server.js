import express from "express"
import cors from "cors"
import { getEpisodeInfo, searchAnime } from "./lib/index.js"
import { filterEpisodes, readJsonFile } from "./lib/utils.js"

const app = express()
const port = process.env.PORT || 5050

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("json spaces", 2)

app.get("/", (req, res) => {
  const myList = readJsonFile("./animes.json")
  return res.status(200).json({ endpoints: ["/anime", "search?q="], animesAvaliable: myList })
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
  try {
    const anime = req.params.anime
    const { data, ...response } = await getEpisodeInfo(anime)

    if (!data) return res.status(404).json({ message: "Anime not found" })

    res.json({ ...response, episodes: filterEpisodes(data) })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Internal server error" })
  }
})

app.use((req, res) => {
  return res.status(404).json({ message: "Page not found" })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
