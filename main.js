const { crawlPage } = require('./crawl')


function main() {
    //process command line inputs
    if(process.argv.length < 3) {
        console.log('no website provided')
        process.exit(1)
    }
    if(process.argv.length > 3) {
        console.log('too many command line args')
        process.exit(1)
    }
    const baseURL = process.argv[2]
    console.log(`starting crawl of ${baseURL}`)
    crawlPage(baseURL)
}
main()

