import express from "express"
import cors from "cors"
import { readJsonFile } from "./lib/utils.js"
import router from "./routes/main.js"

const app = express()
const port = process.env.PORT || 5050

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("json spaces", 2)

app.get("/", (req, res) => {
  const myList = readJsonFile("./assets/animes.json")
  return res.status(200).json({ endpoints: ["/anime", "search?q="], animesAvaliable: myList })
})

app.use("/anime", router)

app.use((req, res) => {
  return res.status(404).json({ message: "Page not found" })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
