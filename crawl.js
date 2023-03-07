const { url } = require("inspector")
const { JSDOM } = require('jsdom')


async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    if(baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }
    
    const normalizedCurrentURL = normalizeURL(currentURL)
    if(pages[normalizedCurrentURL] > 0 ) {
        pages[normalizedCurrentURL]++
        return pages
    }
    pages[normalizedCurrentURL] = 1
    console.log(`actively crawling ${currentURL}`)

    try {
        const response = await fetch(currentURL)
        if(response.status > 399) {
            console.log(`error in fetch with status code: ${response.status}`)
            return pages
        }
        const contentType = response.headers.get("content-type")
        if(!contentType.includes("text/html")) {
            console.log(`content type is not html`)
            return pages
        }

        const htmlBody = await response.text()
        nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for(const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages)
        }
    } catch(err) {
        console.log(`error in fetch: ${err.message}`)
    }
    return pages
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if(hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath.toLowerCase()
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')
    for (const linkElement of links) {
        if(linkElement.href.slice(0, 1) === '/') {
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            } catch(err) {
                console.log(`error with relative url: ${err.message}`)
            }
        } else {
            try {
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            } catch(err) {
                console.log(`error with absolute url: ${err.message}`)
            }
        }
    }
    return urls
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
