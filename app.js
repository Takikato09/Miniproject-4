const body = document.body;
const searchInput = document.querySelector('#search-input');
const imgNumber = document.querySelector('#img-number');
const sizeSelection = document.querySelector('#size-selection');
const submitBtn = document.querySelector('#submit-button');
let errorMessage = document.querySelector('#error-message');
const carouselInnerDiv = document.querySelector('.carousel-inner');

body.addEventListener ('mousemove', function (event){
    //console.log(event.clientX); 
    const hue = event.clientX;
    body.style.backgroundColor = `hsl(${hue}, 70%, 60%)`;
})

submitBtn.addEventListener('click', searchImages);

function searchImages(event){
    event.preventDefault();
    errorMessage.textContent = '';
    const searchText = searchInput.value; 
    const searchNum = imgNumber.value;
    const searchUrl = makeSearchUrl(searchText, searchNum);
    const size = sizeSelection.value;
    const carouselWrapper = document.querySelector('.carousel');
    
    if (size === "m") {
        carouselWrapper.style.width = "20vw";
    } else if (size === "z") {
        carouselWrapper.style.width = "30vw";
    } else {
        carouselWrapper.style.width = "50vw";
    }
    clearSearchResults()
    getImagesFromFlickr(searchUrl)
    animeMessage('Wait, okay? :)')
}

function clearSearchResults(){
    const divEl= document.querySelectorAll('.carousel-item');//this is how to restart the search
        for(let i = 0; i<divEl.length; i++){
            const el = divEl[i];
            el.remove();
        } 
   
}

function makeSearchUrl(searchText, searchNum){
    return `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=ad9dba35f24bf69a6c25f9d98cc8e3c3&text=${searchText}&per_page=${searchNum}&format=json&nojsoncallback=1&sort=relevance&accuracy=1`;
}

function getImagesFromFlickr(url){
    fetch(url)
        .then(
            function (response) {
                return response.json();
            }
        ) 
        .then(
            function (flickrData) {
                console.log(flickrData)
                const size = sizeSelection.value
                
                // loop through the array of photo data and call addImage for each item.
                flickrData.photos.photo.forEach(function (photo) {
                    const url = getImageUrl(photo, size)
                    addImage(url)
                })
                carouselInnerDiv.querySelector('.carousel-item').classList.add('active')
                
                const msg = document.querySelector('#anime-message')
                msg.style.display= 'none';

            }
    ).catch(
        function(error) {
            console.log(error);
            errorMessage.textContent = 'Cannot find the image you are looking for. Try again!'
        }
    )
}

function getImageUrl(photoObject, size){
    let photo = photoObject;
    let imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
    return imgUrl;
}

function addImage(url){
    const img = document.createElement('img');
    img.src = url;
    img.classList.add("d-block", "w-100", "carousel-image")
    const carouselItemDiv = document.createElement('div');
    carouselItemDiv.classList.add("carousel-item")
    carouselItemDiv.appendChild(img);
    carouselInnerDiv.appendChild(carouselItemDiv);
}

function animeMessage(message){
    const msg = document.querySelector('#anime-message');
    msg.style.display= 'block';
    msg.innerText = message;

    animationMessage.play();
}
const animationMessage = anime({
    targets: document.querySelector('#anime-message'), 
    color: 'black',
    translateX: 0,
    scale: 2,
    rotate: '1turn'
})

