import express from "express"
import cors from "cors"
import { getEpisodeInfo } from "./lib/index.js"
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

app.get("/anime/:anime", async (req, res) => {
  const anime = req.params.anime

  if (!anime || anime === "") return res.status(400).json({ message: "Anime not provided" })

  try {
    const { data, ...response } = await getEpisodeInfo(anime)
    const result = await Promise.all(data[0].map(async item => {
      const request = await fetcher(item.episode)

      return request.data
    }))

    return res.status(200).json({ response, result })
  } catch (err) {
    res.status(404).json({ message: "Anime not found" })
    console.error(err)
  }
})

app.use((req, res) => {
  return res.status(404).json({ message: "Page not found" })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
