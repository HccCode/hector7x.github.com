if(navigator.serviceWorker){
	navigator.serviceWorker.register("/sw.js")
}

;(function(){

let sticky = false
let currentPosition = 0 

const imageCounter = $("[data-name='image-counter']").attr("content")
//Correo electronico donde recibe
const email = "hectorum9214@gmail.com"

$("#contact-form").on("submit",function(ev){
		ev.preventDefault()

		sendForm($(this))

		return false
	})

$("#sticky-navigation").removeClass("hidden")
$("#sticky-navigation").slideUp(0)

setInterval(()=>{

if(currentPosition < imageCounter){
currentPosition++	
}else{
	currentPosition = 0
}


$("#gallery .inner").css({
	left:"-"+currentPosition*100+"%"
})
},4000)

$(window).scroll(()=>{
	const inBottom = isInBottom()

if(inBottom && !sticky){
//Mostrar la navegacion
sticky = true
stickNavigation()
} 
if(!inBottom && sticky){
	//Ocultar la navegacion
	sticky = false
	unStickNavigation()
}
})

function stickNavigation(){
$("#description").addClass("fixed").removeClass("absolute")
$("#navigation").slideUp()
$("#sticky-navigation").slideDown("fast")
}

function unStickNavigation(){
$("#description").removeClass("fixed").addClass("absolute")
$("#navigation").slideDown("fast")
$("#sticky-navigation").slideUp("fast")
}


function isInBottom(){
	const $description = $("#description")
	const descriptionHeight = $description.height()

	return $(window).scrollTop() > $(window).height() - (descriptionHeight * 2)

}

}) ()