const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHTML(url) {
    const res = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 10000,
    });
    return res.data;
}

async function scrape(url) {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const movies = [];
    $("#movies .content.ct-archive").each((i, el) => {
        const item = $(el);

        const id = item.attr("id");
        const slug = item.find("a").attr("href").split("/").filter(Boolean).pop();
        const title = item.find(".title h2").text().trim();

        const rating = item.find(".desc span").first().text().trim();
        const year = item.find(".desc span").last().text().trim();

        const quality = item.find(".absolute.top-0.right-0 span").text().trim();

        const poster =
            item.find(".poster img").attr("data-src") ||
            item.find(".poster img").attr("src");

        movies.push({
            id,
            title,
            year,
            rating,
            quality,
            poster,
            url: `/api/${slug}`,
        });
    });

    const series = [];
    $("#series .content").each((i, el) => {
        const item = $(el);

        const id = item.attr("id");
        const slug = item.find("a").attr("href").split("/").filter(Boolean).pop();

        const title = item.find(".title h2").text().trim();

        const rating = item.find(".desc span").first().text().trim();
        const year = item.find(".desc span").last().text().trim();

        const quality = item.find(".absolute.top-0.right-0 span").text().trim();

        const poster =
            item.find(".poster img").attr("data-src") ||
            item.find(".poster img").attr("src");

        series.push({
            id,
            title,
            year,
            rating,
            quality,
            poster,
            url: `/api/${slug}`,
        });
    });

    return { movies, series };
}

async function scrapeDetail(url) {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const title = $(".postdetail h1").text().trim();
    const tagline = $(".postdetail .tagline").text().trim();
    const meta = {};

    $(".mr-4").each((i, el) => {
        const link = $(el).find("a");

        let value = $(el).text().trim();

        if (i === 0) {
            meta.year = value;
        } else if (i === 1) {
            meta.country = value;
        } else if (i === 2) {
            meta.duration = value;
        } else {
            console.warn(`Unexpected meta element at index ${i}`);
        }
    });
    const director = $("p strong:contains('Director')")
        .parent()
        .text()
        .replace("Director:", "")
        .trim();
    const rating = $("p strong:contains('Rating')")
        .parent()
        .text()
        .replace("Rating:", "")
        .trim();

    const genres = [];
    $("p.mt-3 a").each((i, el) => {
        genres.push({
            name: $(el).text().trim(),
            url: $(el).attr("href"),
        });
    });
    const sinopsis = $("#tab-1 p").text().trim();
    const poster =
        $("div.poster img").attr("data-src") || $("div.poster img").attr("src");

    let downloads = [];

    if ($("table.download").length > 0) {
        $("table.download tbody").each((i, tbody) => {
            $(tbody)
                .find("tr")
                .each((j, row) => {
                    const $row = $(row);

                    if ($row.hasClass("ini")) return;

                    const name = $row.find("td").first().text().trim();
                    if (!name) return;

                    const linkColumns = $row.find("td").slice(1);

                    const links = [];
                    linkColumns.each((k, col) => {
                        $(col)
                            .find("a")
                            .each((m, a) => {
                                links.push({
                                    host: $(a).text().trim(),
                                    url: $(a).attr("href"),
                                });
                            });
                    });

                    downloads.push({
                        type: "series",
                        name,
                        links,
                    });
                });
        });
    }

    if ($("#dl_tab").length > 0) {
        $("#dl_tab .flex").each((i, el) => {
            const item = $(el);

            const resolution = item.find(".resol").text().trim();
            const links = [];

            item.find(".dl_links a").each((j, a) => {
                links.push({
                    host: $(a).text().trim(),
                    url: $(a).attr("href"),
                });
            });

            const size = item.find(".dl_links b").text().trim() || null;

            downloads.push({
                type: "movie",
                resolution,
                size,
                links,
            });
        });
    }

    return {
        title,
        tagline,
        meta,
        director,
        rating,
        genres,
        sinopsis,
        poster,
        downloads,
    };
}

async function scrapeCategory(baseUrl, page = 1) {
    const url = page > 1 ? `${baseUrl}page/${page}/` : baseUrl;
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    const items = [];

    $("#movies .content.ct-archive").each((i, el) => {
        const item = $(el);
        items.push({
            id: item.attr("id"),
            url: `/api/${item
                .find("a")
                .attr("href")
                .split("/")
                .filter(Boolean)
                .pop()}`,
            title: item.find(".title h2").text().trim(),
            rating: item.find(".desc span").first().text().trim(),
            year: item.find(".desc span").last().text().trim(),
            quality: item.find(".absolute.top-0.right-0 span").text().trim(),
            poster:
                item.find(".poster img").attr("data-src") ||
                item.find(".poster img").attr("src"),
        });
    });

    let totalPages = 1;
    const pagesText = $(".wp-pagenavi .pages").text();
    if (pagesText) {
        totalPages = parseInt(pagesText.split("of")[1].trim());
    }

    return {
        page,
        totalPages,
        items,
    };
}

async function scrapeSearch(keyword, page = 1) {
    const searchUrl = `https://driverays.quest/?s=${encodeURIComponent(
        keyword
    )}&post_type=post`;
    const url = page > 1 ? `${searchUrl}&paged=${page}` : searchUrl;

    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    const items = [];

    $("#movies .content.ct-archive").each((i, el) => {
        const item = $(el);
        const id = item.attr("id");
        const slug = item.find("a").attr("href").split("/").filter(Boolean).pop();

        items.push({
            id,
            title: item.find(".title h2").text().trim(),
            year: item.find(".desc span").last().text().trim(),
            rating: item.find(".desc span").first().text().trim(),
            quality: item.find(".absolute.top-0.right-0 span").text().trim(),
            poster:
                item.find(".poster img").attr("data-src") ||
                item.find(".poster img").attr("src"),
            url: `/api/${slug}`,
        });
    });

    let totalPages = 1;
    const pagesText = $(".wp-pagenavi .pages").text();
    if (pagesText) {
        const parts = pagesText.split("of");
        if (parts.length === 2) {
            totalPages = parseInt(parts[1].trim());
        }
    }

    return {
        keyword,
        page,
        totalPages,
        items,
    };
}

async function scrapeGenres() {
    const url = "https://driverays.quest/genre-list/";
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    const genres = [];

    $(".genres_list .yakx a").each((i, el) => {
        const a = $(el);
        genres.push({
            name: a.text().trim(),
            url: `/api/genres/${a.attr("href").split("/").filter(Boolean).pop()}`,
        });
    });

    return genres;
}

async function scrapeGenrePage(genreSlug, page = 1) {
    const baseUrl = `https://driverays.quest/genres/${genreSlug}/`;
    const url = page > 1 ? `${baseUrl}page/${page}/` : baseUrl;

    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    const items = [];

    $("#movies .content.ct-archive").each((i, el) => {
        const item = $(el);
        const slug = item.find("a").attr("href").split("/").filter(Boolean).pop();
        items.push({
            id: item.attr("id"),
            title: item.find(".title h2").text().trim(),
            year: item.find(".desc span").last().text().trim(),
            rating: item.find(".desc span").first().text().trim(),
            quality: item.find(".absolute.top-0.right-0 span").text().trim(),
            poster:
                item.find(".poster img").attr("data-src") ||
                item.find(".poster img").attr("src"),
            url: `/api/${slug}`,
        });
    });

    let totalPages = 1;
    const pagesText = $(".wp-pagenavi .pages").text(); // misal: "Page 1 of 50"
    if (pagesText) {
        const parts = pagesText.split("of");
        if (parts.length === 2) {
            totalPages = parseInt(parts[1].trim());
        }
    }

    return {
        genre: genreSlug,
        page,
        totalPages,
        items,
    };
}

module.exports = {
    scrape,
    scrapeDetail,
    scrapeCategory,
    scrapeSearch,
    scrapeGenres,
    scrapeGenrePage,
};
