import { Request, Response } from "express"
import { QueryConfig, QueryResult } from "pg"
import format from "pg-format"
import { client } from "../database"
import { IMovie, IPagination } from "../interfaces/interfaces"

export const createMovie = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const validBody = { ...req.body }

  if (!validBody.description) {
    validBody.description = null
  }

  const query: string = format(
    `
    INSERT INTO movies(%I)
    VALUES (%L)
    RETURNING *;
    `,
    Object.keys(validBody),
    Object.values(validBody)
  )
  const queryResult: QueryResult<IMovie> = await client.query(query)

  return res.status(201).json(queryResult.rows[0])
}

export const listAllMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let query: string = `
    SELECT * FROM movies
    OFFSET $1 LIMIT $2;
    `
  if (req.query.sort == "price") {
    query = `
        SELECT * FROM movies
        ORDER BY price
        OFFSET $1 LIMIT $2;
        `
  }
  if (req.query.sort == "duration") {
    query = `
        SELECT * FROM movies
        ORDER BY duration
        OFFSET $1 LIMIT $2;
        `
  }
  if (req.query.sort == "price" && req.query.order == "desc") {
    query = `
        SELECT * FROM movies
        ORDER BY price DESC
        OFFSET $1 LIMIT $2;
        `
  }
  if (req.query.sort == "duration" && req.query.order == "desc") {
    query = `
        SELECT * FROM movies
        ORDER BY duration DESC
        OFFSET $1 LIMIT $2;
        `
  }

  let page = Number(req.query.page) || 1
  let perPage = Number(req.query.perPage) || 5

  if (page < 1) {
    page = 1
  }
  if (perPage < 1 || perPage > 5) {
    perPage = 5
  }

  const queryConfig: QueryConfig = {
    text: query,
    values: [perPage * (page - 1), perPage],
  }

  const BaseURL = `http://localhost:3000/movies`

  let prevPage: string | null = `${BaseURL}?page=${
    page - 1
  }&perPage=${perPage}`
  let nextPage: string | null = `${BaseURL}?page=${
    page + 1
  }&perPage=${perPage}`

  const queryResult: QueryResult<IMovie> = await client.query(queryConfig)

  if (page == 1) {
    prevPage = null
  }
  if (queryResult.rowCount < perPage) {
    nextPage = null
  }

  const pagination: IPagination = {
    previousPage: prevPage,
    nextPage: nextPage,
    count: queryResult.rowCount,
    data: queryResult.rows,
  }
  return res.status(200).json(pagination)
}

export const updateMovieData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  delete req.body.id

  const query: string = format(
    `
        UPDATE movies
        SET (%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
        `,
    Object.keys(req.body),
    Object.values(req.body)
  )

  const queryConfig: QueryConfig = {
    text: query,
    values: [req.params.id],
  }
  const queryResult: QueryResult<IMovie> = await client.query(queryConfig)
  return res.status(200).json(queryResult.rows[0])
}

export const deleteMovie = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const query: string = `
        DELETE FROM movies
        WHERE id = $1;
    `
  const queryConfig: QueryConfig = {
    text: query,
    values: [req.params.id],
  }
  const queryResult: QueryResult = await client.query(queryConfig)
  return res.status(204).send()
}
