function doClick(cgi, text, href) {
    return () => {
        (async () => {
            let h1 = document.createElement('h1')
            h1.innerText = '处理中请稍后'
            document.querySelector('p').before(h1)
            let res = await fetch(`/cgi-bin/${cgi}.cgi?name=${text}&href=${href}`)
            location.reload()
        })()
    }
}

window.onload = () => {

    (async () => {
        let res = await fetch(`/static/sub.db?s=${new Date().getTime()}`)
        let text = await res.text()

        document.querySelectorAll('p>a').forEach(a => {
            let btn = document.createElement('a')
            let href = a.getAttribute('href').match(/\/\d+bz/)[0]
            btn.innerHTML = '订阅'
            btn.href = '#'
            if (text.includes(href)) {
                btn.innerHTML = '取消' + btn.innerHTML
                btn.onclick = doClick('cancel', a.innerText, href)
            } else {
                btn.onclick = doClick('sub', a.innerText, href)
            }

            a.after(btn)
        })

        document.querySelectorAll('.rank-item-right').forEach(a => a.after(document.createElement('hr')))
    })()

}
