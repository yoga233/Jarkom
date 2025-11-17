const express = require("express");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const { specs, swaggerUi } = require("./swagger");

const {
    scrape,
    scrapeCategory,
    scrapeDetail,
    scrapeSearch,
    scrapeGenres,
    scrapeGenrePage,
} = require("./scraper/cheerio");

const app = express();
const cache = new NodeCache({ stdTTL: 60 * 10 });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

app.use(
    "/api/",
    rateLimit({
        windowMs: 60 * 1000,
        max: 20,
        message: { error: "Too many requests, slow down." },
    })
);

app.use(express.json());

app.get("/api/", async (req, res) => {
    const url = req.query.url || "https://driverays.quest/";
    const follow = req.query.follow === "true";

    const cacheKey = `list:${url}:follow=${follow}`;
    if (cache.has(cacheKey))
        return res.json({ cached: true, ...cache.get(cacheKey) });

    try {
        const { movies, series } = await scrape(url);
        const totalMovies = movies.length;
        const totalSeries = series.length;
        const total = totalMovies + totalSeries;

        const payload = {
            cached: false,
            total,
            totalMovies,
            totalSeries,
            movies,
            series,
        };
        cache.set(cacheKey, payload);
        res.json(payload);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get(["/api/movies", "/api/movies/page/:page"], async (req, res) => {
    const page = parseInt(req.query.page) || parseInt(req.params.page) || 1;
    const url = "https://driverays.quest/category/movies/";

    const cacheKey = `movies:${page}`;
    if (cache.has(cacheKey))
        return res.json({ cached: true, ...cache.get(cacheKey) });

    try {
        const data = await scrapeCategory(url, page);

        const payload = {
            cached: false,
            page: data.page,
            totalPages: data.totalPages,
            items: data.items,
            pagination: {
                first: "/api/movies/page/1",
                last: `/api/movies/page/${data.totalPages}`,
                prev: page > 1 ? `/api/movies/page/${page - 1}` : null,
                next: page < data.totalPages ? `/api/movies/page/${page + 1}` : null,
            },
        };

        cache.set(cacheKey, payload);
        res.json(payload);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get(["/api/series", "/api/series/page/:page"], async (req, res) => {
    const page = parseInt(req.query.page) || parseInt(req.params.page) || 1;
    const url = "https://driverays.quest/category/series/";

    const cacheKey = `series:${page}`;
    if (cache.has(cacheKey))
        return res.json({ cached: true, ...cache.get(cacheKey) });

    try {
        const data = await scrapeCategory(url, page);

        const payload = {
            cached: false,
            page: data.page,
            totalPages: data.totalPages,
            items: data.items,
            pagination: {
                first: "/api/series/page/1",
                last: `/api/series/page/${data.totalPages}`,
                prev: page > 1 ? `/api/series/page/${page - 1}` : null,
                next: page < data.totalPages ? `/api/series/page/${page + 1}` : null,
            },
        };

        cache.set(cacheKey, payload);
        res.json(payload);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get("/api/genres", async (req, res) => {
    const cacheKey = "genres:all";
    if (cache.has(cacheKey))
        return res.json({ cached: true, data: cache.get(cacheKey) });

    try {
        const genres = await scrapeGenres();
        cache.set(cacheKey, genres);
        res.json({ cached: false, data: genres });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get(
    ["/api/genres/:genre", "/api/genres/:genre/page/:page"],
    async (req, res) => {
        const genre = req.params.genre;
        const page = parseInt(req.query.page) || parseInt(req.params.page) || 1;

        const cacheKey = `genre:${genre}:${page}`;
        if (cache.has(cacheKey)) {
            return res.json({ cached: true, ...cache.get(cacheKey) });
        }

        try {
            const data = await scrapeGenrePage(genre, page);

            const payload = {
                cached: false,
                genre: data.genre,
                page: data.page,
                totalPages: data.totalPages,
                items: data.items,
                pagination: {
                    first: `/api/genres/${genre}/page/1`,
                    last: `/api/genres/${genre}/page/${data.totalPages}`,
                    prev: page > 1 ? `/api/genres/${genre}/page/${page - 1}` : null,
                    next:
                        page < data.totalPages
                            ? `/api/genres/${genre}/page/${page + 1}`
                            : null,
                },
            };

            cache.set(cacheKey, payload);
            res.json(payload);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
);

app.get(
    ["/api/search", "/api/search/:keyword", "/api/search/:keyword/page/:page"],
    async (req, res) => {
        const keyword = req.query.keyword || req.params.keyword;
        const page = parseInt(req.query.page) || parseInt(req.params.page) || 1;

        if (!keyword) {
            return res.status(400).json({ error: "Missing search keyword" });
        }

        const cacheKey = `search:${keyword}:${page}`;
        if (cache.has(cacheKey)) {
            return res.json({ cached: true, ...cache.get(cacheKey) });
        }

        try {
            const data = await scrapeSearch(keyword, page);

            const payload = {
                cached: false,
                keyword: data.keyword,
                page: data.page,
                totalPages: data.totalPages,
                items: data.items,
                pagination: {
                    first: `/api/search/${encodeURIComponent(keyword)}/page/1`,
                    last: `/api/search/${encodeURIComponent(keyword)}/page/${data.totalPages}`,
                    prev:
                        data.page > 1
                            ? `/api/search/${encodeURIComponent(keyword)}/page/${data.page - 1}`
                            : null,
                    next:
                        data.page < data.totalPages
                            ? `/api/search/${encodeURIComponent(keyword)}/page/${data.page + 1}`
                            : null,
                },
            };

            cache.set(cacheKey, payload);
            res.json(payload);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
);

app.get("/api/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        const fullUrl = `https://driverays.quest/${slug}/`;

        const data = await scrapeDetail(fullUrl);

        res.json({
            success: true,
            slug,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
});