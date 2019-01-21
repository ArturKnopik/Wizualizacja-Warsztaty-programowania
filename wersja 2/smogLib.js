var getDataFromChannel = function(id, elementIdToPresentData){
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
			       analizeAndDrawResults(xhttp.responseText, elementIdToPresentData)
			       
			    }
			};
			//results = 15 - w godzine zbiera okolo 15 pomiarów
			xhttp.open("GET", "https://api.thingspeak.com/channels/" + id + "/feeds.json?offset=1&results=15", true);
			xhttp.send();
		
		}

var analizeAndDrawResults = function(responseText, elementIdToPresentData){
	//Zamieniamy text jaki przyszedł z serwera na objekt javascriptowy
			       var responseJson = JSON.parse(responseText);
			       console.log(responseJson);
			       //tworzymy tablice z pomiarami
			       var measurementsArray = responseJson.feeds;
			       console.log(measurementsArray);

			       var lastMeasurement = getLastMeasurement(measurementsArray);

				   var avarages = calculateAvarage(measurementsArray);
				   drawResult(lastMeasurement, avarages, elementIdToPresentData);
			       }

function drawResult (lastMeasurement, avarages, elementIdToPresentData){
	var canvas = document.getElementById(elementIdToPresentData);
	var ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = true;
	ctx.fillStyle= "rgba(26,30,46,1)";
	ctx.fillRect(0,0,300,250);
	ctx.strokeStyle = "rgba(255,255,255,0.4)"; // nie wiem jak to dziala ale fajny efekt :D
	drawStrokeRect(ctx, 65, 85, 227, 20, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 6, "rgba(150,150,150,1)");
	drawStrokeRect(ctx, 65, 120, 227, 20, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 6, "rgba(150,150,150,1)");
	drawStrokeRect(ctx, 65, 185, 227, 20, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 6, "rgba(150,150,150,1)");
	drawStrokeRect(ctx, 65, 220, 227, 20, "rgb(0, 255, 0)", "rgb(255, 0, 0)", 6, "rgba(150,150,150,1)");

	for( var i=10; i>0 ; i--)
	{
		var colorValueLastMeasurement = lastMeasurement.pm25*2.125
		var colorValueAvaragesMeasurement = avarages.pm25*2.125;
		var r = 0+colorValueLastMeasurement;
		var g = 255-colorValueLastMeasurement;
		var b = 0;
		var col = "rgba(" + r + "," + g + "," + b + "," + (1/i) + ")";
		drawStrokeRect(ctx,10-i*1.5,0-i*1.5,280+2*i*1.5,35+2*i*1.5,col, col, 0, col);
	}


	var currentState;
	if(lastMeasurement.pm25 >= 120)
	{
		currentState="Bardzo Zły";
		ctx.font = "28px Impact";
	}
	else if(lastMeasurement.pm25 >= 84 && lastMeasurement.pm25 < 120)
	{
		currentState="Zły";
		ctx.font = "34px Impact";
	}
	else if(lastMeasurement.pm25 >= 60 && lastMeasurement.pm25 < 84)
	{
		currentState="Dostateczny";
		ctx.font = "25px Impact";
	}
	else if(lastMeasurement.pm25 >= 35 && lastMeasurement.pm25< 60)
	{
		currentState="Umiarkowany";
		ctx.font = "24px Impact";
	}
	else if(lastMeasurement.pm25 >= 11)
	{
		currentState="Dobry";
		ctx.font = "32px Impact";
	}
	else if(lastMeasurement.pm25>0)
	{
		currentState="Bardzo Dobry";
		ctx.font = "24px Impact";
	}
	//ctx.font = "24px Impact";
	//currentState="Bardzo Dobry";


	
	// aktualna arrow
	var currentValue = lastMeasurement.pm25;
	if(lastMeasurement.pm25>120)
	{
		currentValue=119;
	}
	else
	{
		currentValue=lastMeasurement.pm25;
	}
	drawArrow(ctx,60+(currentValue*1.892),79);
	if(lastMeasurement.pm10>200)
	{
		currentValue=199;
	}
	else
	{
		currentValue=lastMeasurement.pm10;
	}
	drawArrow(ctx,60+(currentValue*1.135),115);

	//srednia arrow
	if(avarages.pm25>120)
	{
		currentValue=119;
	}
	else
	{
		currentValue=avarages.pm25;
	}
	drawArrow(ctx,60+(currentValue*1.892),180);
	if(avarages.pm10>200)
	{
		currentValue=199;
	}
	else
	{
		currentValue=avarages.pm25;
	}
	drawArrow(ctx,60+(currentValue*1.135),215);

	ctx.font = "30px Impact";
	drawStrokeText(ctx, 150, 30, "center", "rgba(255,255,255,1)", 1.5, "rgba(21,30,43,1)",  currentState);
	ctx.font = "12px Impact";
	//drawStrokeText(ctx, 150, 47, "center", "rgba(255,255,255,1)", 1.3, "rgba(21,30,43,0.8)",  "Data ostatniego pomiaru: " + dateConverter( lastMeasurement.date));
	// napis oraz data ostatniego pomiaru
	ctx.font = "23px Impact";
	drawStrokeText(ctx, 180, 62, "center", "rgba(255,255,255,1)", 1.4, "rgba(21,30,43,0.9)", "Ostatni pomiar");	
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 180, 78, "center", "rgba(255,255,255,1)", 1.5, "rgba(21,30,43,0.8)", dateConverter( lastMeasurement.date));


	//typ pomiaru - pm10   ------------------------------------------
	ctx.font = "18px Impact";
	drawStrokeText(ctx, 30, 130, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,1)", "PM10");
	// wynik 
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 15, 145, "left", "rgba(255,255,255,1)", 1.2, "rgba(21,30,43,1)", Round(lastMeasurement.pm10, 2));

	//typ pomiaru - pm2.5   ------------------------------------------
	ctx.font = "18px Impact";
	drawStrokeText(ctx, 30, 95, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,1)", "PM2.5");
	//wynik
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 15, 110, "left", "rgba(255,255,255,1)", 1.2, "rgba(21,30,43,1)", Round(lastMeasurement.pm25, 2));


	// napis oraz data średni pomiar pomiaru
	ctx.font = "23px Impact";
	drawStrokeText(ctx, 180, 163, "center", "rgba(255,255,255,1)", 1.4, "rgba(21,30,43,0.9)", "Średnia 15 pomiarów");	
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 177, 179, "center", "rgba(255,255,255,1)", 1.5, "rgba(21,30,43,0.8)", dateConverter(avarages.dateStart) + "  " +  dateConverter( avarages.dateEnd));


	//typ pomiaru AVARAGE - pm10   ------------------------------------------
	ctx.font = "18px Impact";
	drawStrokeText(ctx, 30, 233, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,1)", "PM10");
	// wynik 
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 15, 248, "left", "rgba(255,255,255,1)", 1.2, "rgba(21,30,43,1)", Round(avarages.pm10, 2));

	//typ pomiaru -AVARAGE pm2.5   ------------------------------------------
	ctx.font = "18px Impact";
	drawStrokeText(ctx, 30, 193, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,1)", "PM2.5");
	//wynik
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 15, 208, "left", "rgba(255,255,255,1)", 1.2, "rgba(21,30,43,1)", Round(avarages.pm25, 2));


}

function drawStrokeRect(ctx, x, y, w, h, colouStart, colorEnd, strokeWidth, strokeColour)
{
	var my_gradient = ctx.createLinearGradient(x, 0, x+w, 0);
my_gradient.addColorStop(0, colouStart);
my_gradient.addColorStop(1, colorEnd);
ctx.fillStyle = my_gradient;
ctx.fillRect(x, y, w, h);
	if(strokeWidth!=0)
	{
		ctx.lineWidth = strokeWidth;
		ctx.fillStyle= strokeColour;
		ctx.strokeRect(x,y,w,h);
	}
	//ctx.fillText(	JSON.stringify(lastMeasurement), 10, 50);	
}

function drawStrokeCircle(ctx, x, y, r, colour, strokeWidth, strokeColour)
{
	ctx.beginPath();
	ctx.arc(x, y, r	, 0, 2 * Math.PI);
	ctx.strokeStyle = strokeColour;
	ctx.lineWidth = strokeWidth;
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.arc(x, y, r	, 0, 2 * Math.PI);
	ctx.lineWidth = strokeWidth-2	;
	ctx.strokeStyle = colour;
	ctx.stroke();
	ctx.closePath()
}

function drawStrokeText(ctx, x, y, textAlignment, colour, strokeWidth, strokeColour, text)
{
	ctx.closePath()
	ctx.beginPath();
	//ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.fillStyle = colour;
	//ctx.textAlign = "center"
	ctx.textAlign=textAlignment;

	ctx.fillText(text, x, y);
	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = strokeColour;
	//ctx.strokeStyle = "rgba(0,0,0,0.5)";
	ctx.strokeText( text, x, y);
	ctx.closePath()
}




function Round(n, k) 
{
    var factor = Math.pow(10, k+1);
    n = Math.round(Math.round(n*factor)/10);
    return n/(factor/10);
}

var calculateAvarage = function(measurementsArray){
	//TODO: ktoś musi napisać kod do liczenia średniej z wyników
	var avPm25 = 0.0;
	var avPm10 =0.0;
	for (i = 0; i < measurementsArray.length; i++) { 
		avPm25=avPm25+parseFloat(measurementsArray[i].field1);
		avPm10=avPm10+parseFloat(measurementsArray[i].field2);
	  }

	dateStart = measurementsArray[measurementsArray.length-1].created_at;
	dateEnd = measurementsArray[0].created_at;
	return {"pm25": avPm25/measurementsArray.length, "pm10": avPm10/measurementsArray.length, "dateStart": dateStart, "dateEnd": dateEnd}
}

var getLastMeasurement = function(measurementsArray){
	//TODO: ktoś musi napisać kod do pobierania ostatniego pomiaru
	avPm25 = measurementsArray[measurementsArray.length-1].field1;
	avPm10 = measurementsArray[measurementsArray.length-1].field2;
	date = measurementsArray[measurementsArray.length-1].created_at;
	return {"pm25": avPm25, "pm10": avPm10, "date": date}
}

//przyjmuje jako argument date w postaci niezmienionej z serwera np 2018-12-15T17:12:03+01:00
function dateConverter(date)
{
	var dateFormat = date.slice(0, 11);
	var hourFormat = date.slice(11, 19);

	dateFormat = dateFormat.slice(8, 10) + "-" + dateFormat.slice(5, 7) + "-" + dateFormat.slice(0, 4);
	return (hourFormat  + " " + dateFormat );
}

function drawArrow(ctx, x,y)
{
	ctx.fillStyle="rgba(255,255,255,1)";
	ctx.beginPath();
    ctx.moveTo(2+x,2+y);
	ctx.lineTo(8+x,2+y);
	ctx.lineTo(6+x,6+y);
	ctx.lineTo(6+x,24+y);
	ctx.lineTo(8+x,28+y);
	ctx.lineTo(2+x,28+y);
	ctx.lineTo(4+x,24+y);
	ctx.lineTo(4+x,6+y);
	ctx.fill();
	ctx.strokeStyle= "rgba(36,55,111,1)";
	ctx.lineWidth = 1.3;
	ctx.closePath();
	ctx.stroke();
}	



var modal;

// Get the button that opens the modal
var btn;

// Get the <span> element that closes the modal
var span;

document.addEventListener('DOMContentLoaded', function() {
	modal = document.getElementById('myModal');

	// Get the button that opens the modal
	 btn = document.getElementById("myBtn");

	// Get the <span> element that closes the modal
	 span = document.getElementsByClassName("close")[0];

	 // When the user clicks the button, open the modal 
	btn.onclick = function() {
	modal.style.display = "block";
	console.log("clock button")
  }
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
	modal.style.display = "none";
	console.log("clock span");
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
	if (event.target == modal) {
	  modal.style.display = "none";
	  console.log("clock modal")
	}
  }
}, false);




