const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Driverays API',
    version: '1.0.0',
    description: 'API documentation for scraping Driverays movie and series data',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./swagger.js'], // This file will contain the endpoint definitions
};

const specs = swaggerJSDoc(options);

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         year:
 *           type: string
 *         rating:
 *           type: string
 *         quality:
 *           type: string
 *         poster:
 *           type: string
 *         url:
 *           type: string
 *     MovieResponse:
 *       type: object
 *       properties:
 *         cached:
 *           type: boolean
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 *     SeriesResponse:
 *       type: object
 *       properties:
 *         cached:
 *           type: boolean
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 *     GenreItem:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         url:
 *           type: string
 *     GenrePageResponse:
 *       type: object
 *       properties:
 *         cached:
 *           type: boolean
 *         genre:
 *           type: string
 *         page:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 *         pagination:
 *           type: object
 *     DetailResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         slug:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             tagline:
 *               type: string
 *             meta:
 *               type: object
 *               properties:
 *                 year:
 *                   type: object
 *                 country:
 *                   type: object
 *                 duration:
 *                   type: string
 *             director:
 *               type: string
 *             rating:
 *               type: string
 *             genres:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GenreItem'
 *             sinopsis:
 *               type: string
 *             poster:
 *               type: string
 *             downloads:
 *               type: array
 *               items:
 *                 type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Get movies and series from homepage
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: Base URL (optional, defaults to driverays.quest)
 *       - in: query
 *         name: follow
 *         schema:
 *           type: string
 *         description: If 'true', fetch detailed info (optional)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get movies from category page
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional, defaults to 1)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cached:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/movies/page/{page}:
 *   get:
 *     summary: Get movies from category page by page number
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cached:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/series:
 *   get:
 *     summary: Get series from category page
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional, defaults to 1)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cached:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/series/page/{page}:
 *   get:
 *     summary: Get series from category page by page number
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cached:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Get all available genres
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cached:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GenreItem'
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/genres/{genre}:
 *   get:
 *     summary: Get items for a specific genre
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre name (URL-encoded)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional, defaults to 1)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenrePageResponse'
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/genres/{genre}/page/{page}:
 *   get:
 *     summary: Get items for a specific genre by page number
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre name (URL-encoded)
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenrePageResponse'
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search for movies and series
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional, defaults to 1)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cached:
 *                   type: boolean
 *                 keyword:
 *                   type: string
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 pagination:
 *                   type: object
 *       400:
 *         description: Missing keyword
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/search/{keyword}:
 *   get:
 *     summary: Search for movies and series by keyword in URL
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword (URL-encoded)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional, defaults to 1)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cached:
 *                   type: boolean
 *                 keyword:
 *                   type: string
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 pagination:
 *                   type: object
 *       400:
 *         description: Missing keyword
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/search/{keyword}/page/{page}:
 *   get:
 *     summary: Search for movies and series by keyword and page number
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword (URL-encoded)
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cached:
 *                   type: boolean
 *                 keyword:
 *                   type: string
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 pagination:
 *                   type: object
 *       400:
 *         description: Missing keyword
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/{slug}:
 *   get:
 *     summary: Get detailed information for a movie or series
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the movie or series
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

module.exports = {
  specs,
  swaggerUi,
};
