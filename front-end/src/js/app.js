const overlay = $("#overlay");
const btnUpload = $("#btn-upload");
const dropZoneElm = $("#drop-zone");
const mainElm = $("main");
const REST_API_URL = `http://localhost:8080/gallery`;
const cssLoaderHtml = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;

loadAllImages();

btnUpload.on('click', () => overlay.removeClass('d-none'));
overlay.on('click', (evt) => {
    if (evt.target === overlay[0]) overlay.addClass('d-none');
});
$(document).on('keydown', (evt) => {
    if (evt.key === 'Escape' && !overlay.hasClass('d-none')) {
        overlay.addClass('d-none');
    }
});
overlay.on('dragover', (evt) => evt.preventDefault());
overlay.on('drop', (evt) => evt.preventDefault());
dropZoneElm.on('dragover', (evt) => {
    evt.preventDefault();
});
dropZoneElm.on('drop', (evt) => {
    evt.preventDefault();
    const droppedFiles = evt.originalEvent
        .dataTransfer.files;
    const imageFiles = Array.from(droppedFiles)
        .filter(file => file.type.startsWith("image/"));
    if (!imageFiles.length) return;
    overlay.addClass("d-none");
    uploadImages(imageFiles);
});
mainElm.on('click', '.image:not(.loader)', (evt)=> {
    if(evt?.target.classList.contains("image-container")){
        evt.target.requestFullscreen();
    }
});

mainElm.on('click', (evt)=> {
    if((evt?.target.classList.contains("download-icon"))){
        alert("ok");
        const downUrl = $(evt.target).parents('div').css('background-image').replace('url("', '').replace('")', '');;
        const imageName = downUrl.replace(`${REST_API_URL}/images/`, "");
        saveAs(downUrl, imageName);
    }
});



function uploadImages(imageFiles){
    const formData = new FormData();
    imageFiles.forEach(imageFile => {
        const divElm = $(`<div class="image loader"></div>`);
        divElm.append(cssLoaderHtml);
        mainElm.append(divElm);

        formData.append("images", imageFile);
    });
    const jqxhr = $.ajax(`${REST_API_URL}/images`, {
        method: 'POST',
        data: formData,
        contentType: false,         // by default jQuery uses application/x-www-form-urlencoded
        processData: false          // by default jQuery tries to convert the data into String
    });

    jqxhr.done((imageUrlList)=> {
        imageUrlList.forEach(imageUrl => {
            const divElm = $(".image.loader").first();
            divElm.css('background-image', `url('${imageUrl}')`);
            divElm.empty();
            divElm.removeClass('loader');
        });
    });
    jqxhr.always(()=> $(".image.loader").remove());
}


function loadAllImages() {
    const jqxhr = $.ajax(`${REST_API_URL}/images`);
    jqxhr.done((imageUrlList) => {
        imageUrlList.forEach(imageUrl => {
            const divElm = $(`<div class="image"></div>`);
            divElm.addClass('image-container');
            divElm.css('background-image', `url(${imageUrl})`);
            const downloadElm = $(`<button type="button" class="btn btn-light">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"
                                     className="bi bi-cloud-arrow-down-fill" class="download-icon" viewBox="0 0 16 16">
                                    <path class="download-icon"
                                        d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/>
                                    </svg>
            </button>`)
            downloadElm.addClass('download-button');
            downloadElm.addClass('download-icon');
            divElm.append(downloadElm)
            mainElm.append(divElm);
        });
    });
    jqxhr.fail(() => {
    });
}