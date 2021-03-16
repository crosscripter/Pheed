window.addEventListener('load', async function (e) {
    let [user, site=''] = window.location.pathname.split('/').filter(Boolean)

     // Get profile pic
    let profile = await (await fetch('/profile/' + user)).text()
    console.log('profile', profile)
    let profileImage = document.querySelector('.profileImage')
    profileImage.src = profile
    profileImage.style.opacity = 1

    // Get banner pic
    let banner = await (await fetch('/banner/' + user)).text()
    console.log('banner', banner)
    let bannerEl = document.querySelector('.banner')
    bannerEl.style.backgroundImage = `url("${banner}")`
    bannerEl.style.opacity = 1


    // Set profile name
    document.querySelector('.username').innerText = '@' + user
    console.log(user, site)

    // Load image grid
    let count = 0
    let allUrls = []
    let renderedUrls = []
    let imageGrid = document.querySelector('.imageGrid')

    async function loadMore() {
        count += 20
        console.log("Loading more images...")
        let data = await fetch(`/images/${user}/${site || ' '}/${count}`)
        let urls = await data.json()
        allUrls.push(...urls)

        let uniqueUrls = Array.from(new Set(allUrls))
        console.log('Unique urls', uniqueUrls.length)

        uniqueUrls.forEach(url => {
            if (!renderedUrls.includes(url)) {
                imageGrid.innerHTML += `<a href='${url}' class='image' data-lightbox='results' data-url='${url}'></div>`
            }
        })

        // Load images lazily
        Array.from(document.querySelectorAll('.image')).forEach(async function (img, index, imgs) {
            const imageUrl = img.dataset.url
            if (renderedUrls.includes(imageUrl)) return
            let preloaderImg = document.createElement("img");
            setTimeout(function () { img.style.display = 'none'; preloaderImg.src = imageUrl; }, index * 30)
            // if (img === imgs[imgs.length - 1]) await loadMore()

            preloaderImg.addEventListener('load', async function (e) {
                img.style.display = 'block'
                img.style.backgroundImage = "url(" + imageUrl + ")"
                img.style.opacity = 1
                
                let domain = ''
                if (/twimg/.test(imageUrl)) {
                    domain = 'www.twitter.com'
                } else if (/reddit|redd.it/.test(imageUrl)) {
                    domain = 'www.reddit.com'
                } else if (/pinimg/.test(imageUrl)) {
                    domain = 'www.pinterest.com'
                } else if (/tumblr/.test(imageUrl)) {
                    domain = 'www.tumblr.com'
                } else if (/ytimg/.test(imageUrl)) {
                    domain = 'www.youtube.com'
                } else if (/wixstatic/.test(imageUrl)) {
                    domain = 'www.wix.com'
                } else {
                    domain = imageUrl.split("/", 3).slice(-1)[0].trim()
                    domain = domain.split('/')[0].trim()
                    domain = domain.split('.').slice(-2).join('.').trim().replace('cdn', '').trim()
                }
                if (domain) {
                    let icon = document.createElement('img')
                    icon.title = domain
                    icon.classList.add('icon')
                    icon.src = 'https://s2.googleusercontent.com/s2/favicons?domain=' + domain 
                    img.innerHTML = ''
                    img.appendChild(icon)
                }

                // if (img === imgs[imgs.length - 1]) img.scrollIntoView({ behavior: 'smooth' })
                renderedUrls.push(imageUrl)
                preloaderImg = null
            })
        })

        let more = document.createElement('div')
        more.classList.add('more')
        more.classList.add('image')
        more.innerText = '...'
        more.addEventListener('click', async e => await triggerLoad())
        imageGrid.appendChild(more)
    }

    async function triggerLoad() {
        let more = document.querySelector('.more')
        more.style.color = 'lightGreen'
        imageGrid.style.opacity = 0.7
        imageGrid.style.filter = 'brightness(0.7)'
        await loadMore()
        imageGrid.style.filter = 'brightness(1)'
        imageGrid.style.opacity = 1 
        more.style.color = '#aaa'
    }

    $(window).scroll(async function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            await triggerLoad()
        }
    })

    await loadMore()
})