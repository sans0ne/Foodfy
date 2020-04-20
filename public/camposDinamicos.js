const newElement = (container,classe,atributo='preparation') => {
    const div = document.createElement('div')
    div.classList.add(classe)
    const input = document.createElement('input')
    input.setAttribute('type','text')
    input.setAttribute('name',`${atributo}[]`)
    div.appendChild(input)
    container.appendChild(div)
}

function addIngredient(){  
    const ingredients = document.querySelector('#ingredients')
    const FieldContainer = document.querySelectorAll('.ingredient')

    if(FieldContainer.length <= 0){
        newElement(ingredients,'ingredient','ingredients')
    }
    const newField = FieldContainer[FieldContainer.length-1].cloneNode(true)//tem que colocar o -1, porque o indice começa do zero

    if(newField.children[0].value == '') return false

    newField.children[0].value = ''
    ingredients.appendChild(newField)

}
document.querySelector('.btn-ingredient').addEventListener('click',addIngredient)

function addPreparation(){ 
    const preparations = document.querySelector('#preparations')
    const FieldPreparation = document.querySelectorAll('.preparation')


    if(FieldPreparation.length <= 0){
        newElement(preparations,'preparation')
    }
    const newField = FieldPreparation[FieldPreparation.length-1].cloneNode(true)
    
    if(newField.children[0].value == '') return false
    
    newField.children[0].value=''
    preparations.appendChild(newField)

}
document.querySelector('.btn-modopreparo').addEventListener('click',addPreparation)

function removeIngredient(){
    const ingredients = document.querySelector('#ingredients')
    const FieldContainer = document.querySelectorAll('.ingredient')

    if(FieldContainer.length <= 0) return

    ingredients.removeChild(ingredients.lastElementChild)
    

}
document.querySelector('.btn-remove-ingredient').addEventListener('click',removeIngredient)

function removePreparation(){
    const preparations = document.querySelector('#preparations')
    const FieldPreparation = document.querySelectorAll('.preparation')

    if(FieldPreparation.length <= 0) return    
    preparations.removeChild(preparations.lastElementChild) 
}
document.querySelector('.btn-remove-preparo').addEventListener('click',removePreparation)