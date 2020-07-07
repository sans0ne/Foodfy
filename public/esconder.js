const esconder = document.querySelectorAll('.esconder')

for(let items of esconder){
    items.addEventListener('click',function(){
        if(items.innerHTML == 'ESCONDER'){
            items.innerHTML = 'MOSTRAR'
            items.nextElementSibling.classList.add('hide')
        }else if (items.innerHTML == 'MOSTRAR'){
            items.innerHTML = 'ESCONDER'
            items.nextElementSibling.classList.remove('hide')
        }
    })
}
