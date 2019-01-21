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

	var colorValueLastMeasurement = lastMeasurement.pm25*2.125
	var colorValueAvaragesMeasurement = avarages.pm25*2.125;
	var r = 0+colorValueLastMeasurement;
	var g = 255-colorValueLastMeasurement;
	var b = 0;
	var col = "rgb(" + r + "," + g + "," + b + ")";
	drawStrokeRect(ctx, 150, 50, 150, 250,col, 10,"rgba(255,255,255,0.2)"  )
	
	var colorValueLastMeasurement = lastMeasurement.pm10*1.275;;
	var colorValueAvaragesMeasurement = avarages.pm10*1.275;
	var r = 0+colorValueLastMeasurement;
	var g = 255-colorValueLastMeasurement;
	var b = 0;
	var col = "rgb(" + r + "," + g + "," + b + ")";
	drawStrokeRect(ctx, 0, 50, 150, 250,col, 10,"rgba(255,255,255,0.2)"  )


	var colorValueLastMeasurement = (lastMeasurement.pm25*2.125+lastMeasurement.pm10*1.275)/2;
	var colorValueAvaragesMeasurement = (avarages.pm25*2.125+avarages.pm10*1.275)/2;
	var r = 0+((colorValueLastMeasurement+colorValueAvaragesMeasurement)/2);
	var g = 255-((colorValueLastMeasurement+colorValueAvaragesMeasurement)/2);
	var b = 0;
	var col = "rgb(" + r + "," + g + "," + b + ")";
	drawStrokeRect(ctx, 0, 0, 300, 50,col, 4,"rgba(255,255,255,0.3)"  )

	ctx.font = "30px Impact";
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
	//ctx.font = "30px Impact";
	drawStrokeText(ctx, 150, 30, "center", "rgba(255,255,255,1)", 1.5, "rgba(21,30,43,1)", "Stan powietrza: " + currentState);
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 150, 47, "center", "rgba(255,255,255,1)", 1.3, "rgba(21,30,43,0.8)",  "Data ostatniego pomiaru: " + dateConverter( lastMeasurement.date));


	// kółka 

	drawStrokeCircle(ctx, 75, 140, 60, "rgba(255,255,255,1)", 13, "rgba(21,30,43,1)" )
	drawStrokeCircle(ctx, 225, 140, 60, "rgba(255,255,255,1)", 13, "rgba(21,30,43,1)" )
	// czujnik pm25
	if(Round(lastMeasurement.pm25, 2)<999.99)
	{
		ctx.font = "38px Impact";
	}
	else
	{
		ctx.font = "30px Impact";
	}
	drawStrokeText(ctx, 75, 150, "center", "rgba(255,255,255,1)", 1.5, "rgba(21,30,43,1)", Round(lastMeasurement.pm10, 2))
	//typ pomiaru
	ctx.font = "21px Impact";
	drawStrokeText(ctx, 75, 108, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,0.8)", "PM");
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 100, 113, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,0.8)", "10");
	//jednostka
	ctx.font = "21px Impact";
	drawStrokeText(ctx, 75, 175, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,0.8)", "µg/m");
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 103, 165, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,0.8)", "3");
	// czujnik mp10
	if(Round(lastMeasurement.pm10, 2)<999.99)
	{
		ctx.font = "38px Impact";
	}
	else
	{
		ctx.font = "30px Impact";
	}
	drawStrokeText(ctx, 225, 150, "center", "rgba(255,255,255,1)", 1.5, "rgba(21,30,43,1)", Round(lastMeasurement.pm25, 2))
	//typ pomiaru
	ctx.font = "21px Impact";
	drawStrokeText(ctx, 225, 108, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,0.8)", "PM");
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 247, 113, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,0.8)", "2.5");
	//jednostka
	ctx.font = "21px Impact";
	drawStrokeText(ctx, 225, 175, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,0.8)", "µg/m");
	ctx.font = "15px Impact";
	drawStrokeText(ctx, 253, 165, "center", "rgba(255,255,255,0.9)", 1.5, "rgba(21,30,43,0.8)", "3");
	// czujnik mp10


	if(Round(avarages.pm10, 2)<999.99) //Round(avarages.pm10, 2)
	{
		ctx.font = "16px Impact";
	}
	else if(Round(avarages.pm10, 2)>= 999.99)
	{
		ctx.font = "13px Impact";	
	}
	drawStrokeText(ctx, 75, 246	, "center", "rgba(255,255,255,1)", 1.4, "rgba(21,30,43,0.9)", "Średnia 1h: " + Round(avarages.pm10 , 2)) //Round(avarages.pm25 , 2)

	if(Round(avarages.pm10, 2)<999.99)
	{
		ctx.font = "16px Impact";
	}
	else
	{
		ctx.font = "13px Impact";	
	}
	drawStrokeText(ctx, 225, 246, "center", "rgba(255,255,255,1)", 1.4, "rgba(21,30,43,0.9)", "Średnia 1h: " + Round(avarages.pm25, 2))	
	ctx.beginPath();
	ctx.moveTo(0, 227);
	ctx.lineTo(400, 227);
	ctx.lineWidth = 6;
	ctx.strokeStyle = "rgba(255,255,255,0.4)"
	ctx.stroke();
}

function drawStrokeRect(ctx, x, y, w, h, colour, strokeWidth, strokeColour)
{
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.fillStyle = colour;
	ctx.lineWidth=strokeWidth;
	ctx.strokeStyle=strokeColour;
	ctx.fill();
	//if(strokeWidth=!0)
	if(strokeWidth==0)
	{

	}
	else 
	{
	ctx.stroke();
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

function checkHover(x1,x2,y1,y2, mouseX, mouseY)
{
	if(mouseX>x1 && mouseX<x2 && mouseY>y1 && mouseY<y2)
	{
		return true;
	}
	return false;
}