document.addEventListener('mousemove', function (event) {

    // console.log(event.pageX)
    // console.log(event.pageY)


    let brightness = (event.pageY / window.innerHeight) * 100
    let hue = (event.pageX / window.innerWidth) * 360

    let saturation = (Math.abs(event.movementX) / 10) * 100


    document.body.style.background = 'hsl(' + hue + ', ' + saturation + '%, ' + brightness + '%)'


})


let howOften = 16
let redSquare = document.querySelector('#groovy')

console.log(redSquare)

let timer

let scale = 0

redSquare.addEventListener('mouseenter', function () {
    scale = 1
    timer = setTimeout(checkHowLong, howOften)
})

redSquare.addEventListener('mouseleave', function () {
    clearTimeout(timer)

    // redSquare.style.transform = 'scale(1)'
})


let chadZoom = 1


let chad = document.querySelector('#groovy')
chad.addEventListener('mousewheel', function (event) {


    chadZoom += event.deltaY / 10

    chad.style.fill = 'hsl(' + chadZoom + ', 100%, 50%)'

    event.preventDefault()
    event.stopPropagation()

})