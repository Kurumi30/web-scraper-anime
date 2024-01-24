import express from "express"
import cors from "cors"
import { accessDownloadPage } from "./lib/index.js"

const app = express()
const port = process.env.PORT || 5050

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("json spaces", 2)

app.get("/", async (req, res) => {
  res.status(200).json(await accessDownloadPage())
})

app.get("/html", (req, res) => {
  res.status(200).send(
    `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Video</title>
    </head>
    <body>
      <video controls>
        <source src="https://saikoanimes.net/download?url=VmFzY29odHRwczovL2Rvd25sb2FkLnNhaWtvYW5pbWVzLm5ldC9hcGkvdjEvZmlsZS1lbnRyaWVzL2Rvd25sb2FkL01UZ3hNek0yZkhCaFpBP3NoYXJlYWJsZV9saW5rPTkyNjgmcGFzc3dvcmQ9bnVsbA%3D%3D&timestamp=1706111206" type="video/mp4">
        Your browser does not support the video tag
      </video>
    </body>
    </html>`
  )
})

app.use((req, res) => {
  res.status(404).json({ message: "Page not found" })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
