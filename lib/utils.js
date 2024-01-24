import axios from "axios"

export async function fetcher(url) {
  try {
    const options = {
      method: "GET",
      "Content-Type": "application/json",
    }
    const { data, status, headers, config, statusText, request } = await axios.get(url, options)

    if (status !== 200) throw new Error(statusText)

    return { data, status, headers, config, statusText, request }
  } catch (err) {
    console.error(err)
  }
}

export function cleanTitle(title) {
  if (!title) return
  
  const parts = title.split('_-_')
  const mainTitle = parts[0].split(']_')[1]
  const episode = parts[1].split('_[')[0]

  title = `${mainTitle}_-_${episode}.mp4`
  return title
}
