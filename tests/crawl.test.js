

const { normalizeURL, getURLsFromHTML } = require('../crawl')
const { test, expect } = require('@jest/globals')

describe('normalizeURL', () => {
    it('should strip protocol', () => {
        const input = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet'
        const actualOutput = normalizeURL(input)
        const expectedOutput = 'developer.mozilla.org/en-us/docs/web/javascript/guide/regular_expressions/cheatsheet'
        expect(actualOutput).toEqual(expectedOutput)
    })
    
    it('should trim trailing slashes', () => {
        const input = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet/'
        const actualOutput = normalizeURL(input)
        const expectedOutput = 'developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet'
        expect(actualOutput).toEqual(expectedOutput)
    })
    
    it('should remove capitals', () => {
        const input = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet'
        const actualOutput = normalizeURL(input)
        const expectedOutput = 'developer.mozilla.org/en-us/docs/web/javascript/guide/regular_expressions/cheatsheet'
        expect(actualOutput).toEqual(expectedOutput)
    })
    
    it('should strip http', () => {
        const input = 'http://developer.mozilla.org/en-us/docs/web/javascript/guide/regular_expressions/cheatsheet'
        const actualOutput = normalizeURL(input)
        const expectedOutput = 'developer.mozilla.org/en-us/docs/web/javascript/guide/regular_expressions/cheatsheet'
        expect(actualOutput).toEqual(expectedOutput)
    })
})

describe('getURLsFromHTML', () => {
    it('should get absolute URLs', () => {
        const inputHTMLBody = `
        <html>
            <body>
                <a href="https://developer.mozilla.org/en-US/docs">
                    JS docs
                </a>
            </body>
        </html>
        `
        const inputBaseURL = "https://developer.mozilla.org/en-US/docs"
        const actualOutput = getURLsFromHTML(inputHTMLBody, inputBaseURL)
        const expectedOutput = ["https://developer.mozilla.org/en-US/docs"]
        expect(actualOutput).toEqual(expectedOutput)
    })
    
    it('should get relative URLs', () => {
        const inputHTMLBody = `
        <html>
            <body>
                <a href="/en-US/docs">
                    JS docs short link
                </a>
            </body>
        </html>
        `
        const inputBaseURL = "https://developer.mozilla.org"
        const actualOutput = getURLsFromHTML(inputHTMLBody, inputBaseURL)
        const expectedOutput = ["https://developer.mozilla.org/en-US/docs"]
        expect(actualOutput).toEqual(expectedOutput)
    })

    it('should handle multiple relative and ablsolute urls', () => {
        const inputHTMLBody = `
        <html>
            <body>
                <a href="/en-US/docs">
                    JS docs short link
                </a>
                <a href="https://developer.mozilla.org/en-US/docs">
                    JS docs
                </a>
                <a href="/en-us/docs/web/javascript/guide/regular_expressions">
                    JS docs regular expressions
                </a>
            </body>
        </html>
        `
        const inputBaseURL = "https://developer.mozilla.org"
        const actualOutput = getURLsFromHTML(inputHTMLBody, inputBaseURL)
        const expectedOutput = ["https://developer.mozilla.org/en-US/docs", "https://developer.mozilla.org/en-US/docs", "https://developer.mozilla.org/en-us/docs/web/javascript/guide/regular_expressions"]
        expect(actualOutput).toEqual(expectedOutput)
    })

    it('should handle invalid URLs', () => {
        const inputHTMLBody = `
        <html>
            <body>
                <a href="invalid">
                    Invalid url
                </a>
            </body>
        </html>
        `
        const inputBaseURL = "https://developer.mozilla.org/en-US/docs"
        const actualOutput = getURLsFromHTML(inputHTMLBody, inputBaseURL)
        const expectedOutput = []
        expect(actualOutput).toEqual(expectedOutput)
    })
})

