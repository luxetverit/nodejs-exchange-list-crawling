const axios = require('axios')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')

async function getExchange() {
    return new Promise(async (resolve, reject) => {
        try {
            let html = await axios({
                method: 'get',
                url: 'https://finance.naver.com/marketindex/exchangeList.naver',
                responseEncoding: 'binary',
            })
            let exchangeList = []
            const contents = iconv.decode(html.data, 'euc-kr').toString()
            const $ = cheerio.load(contents)
            const $bodyList = $('div.tbl_area tbody tr')
            //console.log($bodyList)
            $bodyList.map(function (i, elem) {
                let nation = String(
                    $(elem)
                        .find('td:nth-of-type(1)')
                        .text()
                        .replace(/\t/gi, '')
                        .replace(/\n/g, '')
                )
                let rate = String($(elem).find('td:nth-of-type(2)').text())
                exchangeList.push({
                    nation,
                    rate,
                })
            })
            resolve(exchangeList)
        } catch (error) {
            reject(error)
        }
    })
}

async function getitem() {
    let result = await getExchange()
    console.log(JSON.stringify(result))
}

getitem()
