const locations = location.pathname
const menuItems = document.querySelectorAll('header a')
const mainImage = document.querySelector('#pagina_show')
const smallImages = document.querySelectorAll('.array-photos img')

for(item of menuItems){
    if(locations.includes(String(item.getAttribute('href')))){
        item.classList.add('strong')
    }
}


const pagination = document.querySelector('.pagination')

if(pagination){
    createPagination(pagination)
}

function createPagination(pagination){
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total

    const pages = paginate(page,total)

    let elements = ''

    for(let page of pages){
        if(String(page).includes('...')){
            elements += `<span>${page}</span>`
        }else{
            if(filter){
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            }else{
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }
    pagination.innerHTML = elements
}

function paginate(selectedPage,totalPages){

    let pages=[],
        oldPage

    for(let currentPage=1;currentPage <=totalPages;currentPage++){

        const firstAndLastPage = currentPage ==1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage){
            if(oldPage && currentPage - oldPage > 2){
                pages.push('...')
            }
            if(oldPage && currentPage - oldPage == 2){
                pages.push(oldPage + 1)
            }
            pages.push(currentPage)
            oldPage = currentPage
        }
    }
    return pages
}

const PhotoUpload = {
    input:'',
    preview: document.querySelector('.image-preview'),
    uploadLimit: 5,
    files:[],
    handleFileInput(event) {
        const { files:fileList } = event.target
        PhotoUpload.input = event.target

        if(PhotoUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file =>{

            PhotoUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () =>{
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotoUpload.getContainer(image)

                PhotoUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })
        PhotoUpload.input.files = PhotoUpload.getAllFiles()
    },
    hasLimit(event){
        const { uploadLimit, input, preview } = PhotoUpload
        const { files:fileList } = input

        if(fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} imagens`)
            event.preventDefault()
            return true
        }

        const photosDiv = []

        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value === 'image'){
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit){
            alert('Você atingiu o número máximo de fotos')
            event.preventDefault()
            return true
        }
        return false
    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        PhotoUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image){
        const div = document.createElement('div')
              
        div.classList.add('image')

        div.onclick = PhotoUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotoUpload.getRemoveButton())

        return div
    },
    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removePhoto(event){
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotoUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotoUpload.files.splice(index,1)
        PhotoUpload.input.files = PhotoUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode

        if(photoDiv.id){
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if(removedFiles){
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const setImage = (event) => {
    mainImage.src = event.target.src
    
    smallImages.forEach(image => {
        image.style.opacity = 0.6
    })

    event.target.style.opacity = 1
}

const PhotoUploadChefs = {
    handleFileInput(event) {
        const { files } = event.target

        if(files.length > 1) {
            alert('Envie no máximo 1 imagem')
            event.preventDefault()
        }       
    }
}