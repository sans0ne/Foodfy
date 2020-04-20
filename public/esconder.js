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
// let content = ''
// for(let i=0;i<=esconder.length;i++){
//     esconder[i].addEventListener('click',function(){
//         if(esconder[i].innerHTML == 'ESCONDER'){
//             esconder[i].innerHTML = 'MOSTRAR'
//             content = esconder[i].nextElementSibling.innerHTML
//             esconder[i].nextElementSibling.innerHTML = ''
            
//         }else if (esconder[i].innerHTML == 'MOSTRAR'){
//             esconder[i].innerHTML = 'ESCONDER'
//             esconder[i].nextElementSibling.innerHTML = content
//             content=''
//         }
//     })
// }
