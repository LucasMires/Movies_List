import { NextFunction, Request, Response } from "express"
import { QueryConfig, QueryResult } from "pg"
import { client } from "../database"
import { IMovie } from "../interfaces/interfaces"

export const verifyMovieName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const query: string = `
        SELECT *
        FROM movies
        WHERE name = $1;
        `
  const queryConfig: QueryConfig = {
    text: query,
    values: [req.body.name],
  }
  const queryResult: QueryResult<IMovie> = await client.query(queryConfig)

  if (queryResult.rowCount !== 0) {
    return res.status(409).json({
      message: "Movies already exists.",
    })
  }
  return next()
}

export const verifyMovieId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.params.id

  const query: string = `
            SELECT *
            FROM movies
            WHERE id = $1;
        `
  const queryConfig: QueryConfig = {
    text: query,
    values: [id],
  }
  const queryResult: QueryResult<IMovie> = await client.query(queryConfig)

  if (queryResult.rowCount == 0) {
    return res.status(400).json({
      message: "Movie not found.",
    })
  }
  return next()
}
