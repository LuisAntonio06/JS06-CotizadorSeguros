
function Seguro(marca,year,tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
};

Seguro.prototype.cotizarSeguro = function(){

    let cantidad;
    const base = 2000;

    switch (this.marca) {
        case '1':
            cantidad = base*1.15;
            break;
        case '2':
            cantidad = base*1.05;
            break;
        case '3':
            cantidad = base*1.35;
            break;
        default:
            break;
    };

    const diferencia = new Date().getFullYear() - this.year;
    cantidad -= ((diferencia*3)*cantidad)/100;

    if (this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    };

    return cantidad;
};

function UI(){};
UI.prototype.llenarSelect = () =>{
    const max = new Date().getFullYear();
    const min = max-24;

    const selectYear = document.querySelector('#year');

    for(let i = max ; i>min ; i--){
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    };
};

UI.prototype.mostrarMensaje = (mensaje,tipo) =>{
    const div = document.createElement('div');
    if (tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    };

    div.textContent = mensaje;
    div.classList.add('mt-10');
    const formulario = document.querySelector('#cotizar-seguro');
    const btnSubmit = document.querySelector('#cotizar-seguro button[type="submit"]')
    btnSubmit.disabled = true;
    btnSubmit.style.cursor = 'default';
    btnSubmit.classList.add('opacity-50');
    formulario.insertBefore(div , document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
        btnSubmit.classList.remove('opacity-50');
        btnSubmit.disabled = false;
        btnSubmit.style.cursor = 'pointer';
        ;
    }, 3000);
};

UI.prototype.mostrarResultado = (seguro,cotizacion) => {

    const {marca,year,tipo} = seguro;
    let textoMarca;
    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    };

    const cotizacionHTML = document.createElement('div');
    cotizacionHTML.innerHTML = `
        <p class='header'> Tu cotización</p>
        <p class='font-bold'>Marca: <span class='capitalize font-normal'>${textoMarca}</span> </p>    
        <p class='font-bold'>Año: <span class='capitalize font-normal'>${year}</span> </p>    
        <p class='font-bold'>Tipo: <span class='capitalize font-normal'>${tipo}</span> </p>    
        <p class='font-bold'>Marca: <span class='capitalize font-normal'>${cotizacion}</span> </p>    
    `

    cotizacionHTML.classList.add('mt-10');
    const resultado = document.querySelector('#resultado');
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultado.appendChild(cotizacionHTML);
    }, 3000);


};

const ui = new UI();

document.addEventListener('DOMContentLoaded' , () => {
    ui.llenarSelect();
});

eventListeners();
function eventListeners(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit' , validarCampos);
};

function validarCampos(e){
    e.preventDefault();

    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[type="radio"]:checked').value;

    if (marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Los campos no pueden ir vacíos' , 'error');
        return;
    };  
    ui.mostrarMensaje('Cotizando...' , 'correcto');
    const seguro = new Seguro(marca,year,tipo);
    const cotizacion = seguro.cotizarSeguro();

    const resultados = document.querySelector('#resultado div');
    if (resultados !== null) {
        resultados.remove();
    };

    ui.mostrarResultado(seguro,cotizacion);

    console.log(cotizacion);

};
