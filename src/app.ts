import express, { Application, json } from "express"
import { startDatabase } from "./database/"
import { createMovie, deleteMovie, listAllMovies, updateMovieData } from "./logics/logic"
import { verifyMovieId, verifyMovieName } from "./middlewares/middlewares"

const app: Application = express()
app.use(json())

const PORT = 3000
const serverMsg = "Server is Online"

app.post("/movies", verifyMovieName, createMovie)
app.get("/movies", listAllMovies)
app.patch("/movies/:id", verifyMovieId, verifyMovieName, updateMovieData)
app.delete("/movies/:id", verifyMovieId, deleteMovie)

app.listen(PORT, async () => {
  await startDatabase()
  console.log(serverMsg)
})
