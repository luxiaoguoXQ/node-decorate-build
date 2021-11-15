import * as url from 'url'
export const getUrlQueryObject = (str) => {
    const URL = url.parse(str)
    const pathName = URL.pathname
    const query = {}
    const str1 = URL.query
    if (str1) {
        const splitStrList = str1.split('&')
        for (const s of splitStrList) {
            if (s) {
                const last = s.split('=')
                query[last[0]] = decodeURIComponent(last[1] || '')
            }
        }
    }
    return { pathName, query }
}