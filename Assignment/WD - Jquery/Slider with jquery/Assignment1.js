$(document).ready(() => {

    $('.next').click(() => {
        let currentImage = $('.active');
        let nextImage = currentImage.next();
        if (nextImage.length) {
            currentImage.removeClass('active')
            nextImage.addClass('active')
        }
    })
    $('.prev').click(() => {
        let currentImage = $('.active');
        let prevImage = currentImage.prev();
        if (prevImage.length) {
            currentImage.removeClass('active')
            prevImage.addClass('active')
        }
    })
})