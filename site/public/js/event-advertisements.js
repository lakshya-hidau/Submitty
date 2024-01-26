/* exported changeImage */

const eventAdvertisements = {
    currentImageIndex: 0,
    hiddenImages: undefined,
    seenImages: undefined,
    images: undefined,
    bannerElement: undefined,
    moveDuck: undefined,
    originalDuck: undefined,
    currentImages: [],
};


$(() => {
    document.getElementById('chat-box').style.display = 'none';
    if (document.getElementById('banner') === null) {
        return;
    }

    eventAdvertisements.currentImageIndex = 0;
    eventAdvertisements.hiddenImages = getHiddenImages();
    eventAdvertisements.seenImages = [];
    eventAdvertisements.images = document.getElementsByClassName('club-banners');
    eventAdvertisements.bannerElement = document.getElementById('banner');
    eventAdvertisements.bannerElement.style.display = 'none';
    eventAdvertisements.moveDuck = document.getElementById('duckdivmove');
    eventAdvertisements.moveDuck.style.display = 'none';
    eventAdvertisements.originalDuck = document.getElementById('duckdiv');


    for (let i = 0; i < eventAdvertisements.images.length; i++) {
        const className = eventAdvertisements.images[i].className.split(' ')[1];
        if (!eventAdvertisements.hiddenImages.includes(className)) {
            eventAdvertisements.currentImages.push(eventAdvertisements.images[i]);
        }
        else {
            eventAdvertisements.seenImages.push(eventAdvertisements.images[i]);
        }
    }

    eventAdvertisements.images = eventAdvertisements.currentImages.concat(eventAdvertisements.seenImages);
    if (eventAdvertisements.currentImages.length > 0) {
        document.getElementById('chat-box').style.display = 'block';
    }

    if (Cookies.get('display-banner') === 'yes') {
        showBanners(true); // don't want to make duck move
    }
    else {
        Cookies.set('display-banner', 'no');
    }

    if (eventAdvertisements.images.length > 0) {
        eventAdvertisements.originalDuck.style.cursor = 'pointer';
    }
});
function showBanners(noMove = false) {
    const movingUnit = document.getElementById('moving-unit');
    const bannerElement = document.getElementById('banner');
    if (bannerElement.style.display === 'none' && eventAdvertisements.images.length > 0) {
        eventAdvertisements.currentImageIndex = 0;
        Cookies.set('display-banner', 'yes');

        if (eventAdvertisements.currentImages.length > 0 && !noMove) {
            eventAdvertisements.images[eventAdvertisements.currentImageIndex].classList.add('active');
            eventAdvertisements.moveDuck.style.animation = 'rocking 2s linear infinite';

            setTimeout(() => {
                eventAdvertisements.originalDuck.style.display = 'none';
                eventAdvertisements.moveDuck.style.display = 'block';
                bannerElement.style.display = 'block';
                movingUnit.style.animation = 'slide 2s linear forwards';
            }, 500);

        }
        else {
            eventAdvertisements.originalDuck.style.display = 'none';
            eventAdvertisements.moveDuck.style.display = 'block';
            bannerElement.style.display = 'block';
            eventAdvertisements.images[eventAdvertisements.currentImageIndex].classList.add('active');
        }


    }
    else {

        Cookies.set('display-banner', 'no');
        eventAdvertisements.moveDuck.style.display = 'none';
        movingUnit.style.animation = 'none';
        eventAdvertisements.moveDuck.style.animation = 'none';

        eventAdvertisements.moveDuck.style.transform = 'rotate(0deg)';

        eventAdvertisements.originalDuck.style.display = 'block';
        if (eventAdvertisements.images.length > 0) {
            eventAdvertisements.images[eventAdvertisements.currentImageIndex].classList.remove('active');
        }


        bannerElement.style.display = 'none';

        if (eventAdvertisements.currentImages.length >0) {
            document.getElementById('chat-box').style.display = 'block';
            const className = eventAdvertisements.currentImages[eventAdvertisements.currentImageIndex].className.split(' ')[1];
            eventAdvertisements.hiddenImages.push(className);
            eventAdvertisements.seenImages.push(eventAdvertisements.currentImages[eventAdvertisements.currentImageIndex]);
            eventAdvertisements.currentImageIndex = eventAdvertisements.seenImages.length; // the last currentImage we were at
            eventAdvertisements.currentImages.shift();
            eventAdvertisements.images = eventAdvertisements.currentImages.concat(eventAdvertisements.seenImages);

        }
        else {
            document.getElementById('chat-box').style.display = 'none';
        }
        Cookies.set('hiddenImages', JSON.stringify(eventAdvertisements.hiddenImages));

    }

}

function changeImage(n) {
    const originalIndex = eventAdvertisements.currentImageIndex;
    if (eventAdvertisements.currentImageIndex < 0 || eventAdvertisements.currentImageIndex >= eventAdvertisements.images.length) {
        console.log('Issue of index, you are out of range: ');
        console.log(eventAdvertisements.currentImageIndex);
        return;
    }
    eventAdvertisements.images[eventAdvertisements.currentImageIndex].classList.remove('active');
    if (eventAdvertisements.currentImageIndex < eventAdvertisements.currentImages.length) {

        const className = eventAdvertisements.currentImages[originalIndex].className.split(' ')[1];
        eventAdvertisements.hiddenImages.push(className);
        eventAdvertisements.seenImages.push(eventAdvertisements.currentImages[originalIndex]);
        eventAdvertisements.currentImageIndex = eventAdvertisements.seenImages.length -1;
        eventAdvertisements.currentImages.shift();
        eventAdvertisements.images = eventAdvertisements.currentImages.concat(eventAdvertisements.seenImages);
        Cookies.set('hiddenImages', JSON.stringify(eventAdvertisements.hiddenImages));
    }
    eventAdvertisements.currentImageIndex += n;

    if (eventAdvertisements.currentImageIndex < 0) {
        eventAdvertisements.currentImageIndex = eventAdvertisements.images.length - 1;
    }
    else if (eventAdvertisements.currentImageIndex >= eventAdvertisements.images.length) {
        eventAdvertisements.currentImageIndex = 0;
    }

    eventAdvertisements.images[eventAdvertisements.currentImageIndex].classList.add('active');

}

function getHiddenImages() {
    const hiddenImagesCookie = Cookies.get('hiddenImages');
    return hiddenImagesCookie ? JSON.parse(hiddenImagesCookie) : [];
}

