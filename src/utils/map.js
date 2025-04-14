/*
 * 异步创建script标签
 */
export default function MapLoader() {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap)
        } else {
            var url = 'https://webapi.amap.com/maps?v=1.4.15&key=d4332e5adb8b584442266763d20b978c&callback=onLoad'
            var script = document.createElement('script')
            script.charset = 'utf-8'
            script.src = url
            script.onerror = reject
            document.head.appendChild(script)
        }
        window.onLoad = () => {
            resolve(window.AMap)
        }
    })
}