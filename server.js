import express from "express"
import cors from "cors"
import { getEpisodeInfo } from "./lib/index.js"
import { fetcher } from "./lib/utils.js"

const app = express()
const port = process.env.PORT || 5050

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("json spaces", 2)

app.get("/youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e-3rd-season", async (req, res) => {
  const anime = "youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e-3rd-season"
  const { data, ...response } = await getEpisodeInfo(anime)
  const result = await Promise.all(data[0].map(async item => {
    const request = await fetcher(item.episode)

    return request.data
  }))

  res.status(200).json({ response, result })
})

app.use((req, res) => {
  res.status(404).json({ message: "Page not found" })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
