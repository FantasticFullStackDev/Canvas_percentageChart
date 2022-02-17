class Canvas {
    constructor (canvasId, colors, images, center, radius, lineWidth, type) {
            this.canvas = document.getElementById(canvasId); // canvas object
            this.context = this.canvas.getContext("2d"); // context of the canvas
            this.colors = colors; // colors of percent circles
            this.images = images; // image icons
            this.center = center; // center position of the circle { xPos: 100, yPos: 100 }
            this.radius = radius; // radius of the circle
            this.lineWidth = lineWidth; // lineWidth of the circle
            this.type = type;
    }
    
    //---- Start to draw circle ----
    start = (percent, points, user_status) => {
            this.points = points;
            this.startPercent = 0;
            this.endPercent = percent;
            this.user_status = user_status;
            this.currentImg = document.createElement("img");
            this.currentImg.src = this.images[user_status];
            this.interval = setInterval(this.drawChart, 10);
    }

    //---- Iterate from 0 to percent value to make animation ----
    drawChart = () => {
        this.clear();
        this.drawMultiRadiantCircle(this.startPercent);
        if(this.startPercent == this.endPercent) {
            this.stop();
        } else {
            this.startPercent ++;
        }
    }

    //---- Clear the canvas area ----
    clear = () => {
        this.context = this.canvas.getContext("2d");
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //---- Stop drawing circle ----
    stop = () => {
        clearInterval(this.interval);
    }

    //---- Draw the image, circle and text ----
    drawMultiRadiantCircle = (percent) => {
        var user_status = this.user_status;
        var xc = this.center.xPos;
        var yc = this.center.yPos;
        var r = this.radius;
        var length = (percent * Math.PI) / 50;
        var start = -Math.PI / 2;
        var ctx = this.context;

        if(this.type === "top") {
            ctx.beginPath();
            // Text inside of circle
            ctx.font = "bold 16px Roboto";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(this.points, xc, yc+ 5);
            ctx.closePath();
        }

        //Add Icon
        var imgWidth = 2 * r - 4 * this.lineWidth;
        var imgHeight = imgWidth * this.currentImg.height / this.currentImg.width;
        if(this.type === "top")
            ctx.drawImage(this.currentImg, xc - imgWidth / 2, (yc - r - this.lineWidth - imgHeight), imgWidth, imgHeight); // adds icon to the top
        else
            ctx.drawImage(this.currentImg, xc - imgWidth / 2, yc - imgHeight / 2, imgWidth, imgHeight); // adds icon to the center

        // draw background ring
        ctx.beginPath();
        if(user_status === "diamond" || user_status === "gold")
            ctx.strokeStyle = "#868480";
        else    
            ctx.strokeStyle = "#d5d5d5";
        ctx.arc(xc, yc, r, 0, 2*Math.PI);
        ctx.lineWidth = this.lineWidth - 1;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        let grd = ctx.createLinearGradient(xc + r, yc - r, xc - r, yc + r);      
        if(user_status === "diamond" || user_status === "gold")
            ctx.strokeStyle = this.colors[user_status][0];
        else {
            grd.addColorStop(0, this.colors[user_status][0]);
            grd.addColorStop(0.25, this.colors[user_status][0]);
            grd.addColorStop(0.5, this.colors[user_status][1]);
            grd.addColorStop(0.75, this.colors[user_status][2]);
            grd.addColorStop(1, this.colors[user_status][2]);
            ctx.strokeStyle = grd;
        }
        ctx.arc(xc, yc, r, start, start + length);
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.closePath();
    }

    //---- Get prepared and start to draw circle ----
    setPointsAndStart = (points) => {
        var percent = 0;
        var user_status; 

        if (points >= 0 && points <= 999) {
           if (points > 0 && points <= 9) {
              percent = 10 * (100 / 1000);
           } else {
              percent = points * (100 / 1000);
           }
           user_status = "star";
           points = !points ? points: 1000 - points;
        }

        if (points >= 1000 && points <= 4999) {
           if (points == 1000) {
              percent = 0;
           } else {
              percent = points * (100 / 5000);
           }
           user_status = "silver";
           points = 5000 - points;
        }

        if (points >= 5000 && points <= 9999) {
           if (points > 5000 && points <= 5100) {
              percent = 1;
           } else {
              percent = (points - 5000) * (100 / 5000);
           }  
           user_status = "gold";
           points = 10000 - points; 
        }

        if (points >= 10000 && points <= 14999) {
           if (points > 10000 && points < 10050) {
              percent = 1;
           } else {
              percent = (points - 10000) * (100 / 5000);
           }
            user_status = "platinum";
            points = 15000 - points;
        }

        if (points >= 15000 && points <= 24999) {
           if (points > 15000 && points <= 15100) {
              percent = 1;
           } else {
              percent = (points - 15000) * (100 / 10000);
           }
           user_status = "diamond";
           points = 25000 - points;
        }

        if (points >= 25000) {
            centerIconCanvas.clear();
            user_status = "undefined";
            points = 0;
        }

        percent = percent - percent % 1; // convert decimal to integer

        if(user_status !== "undefined") {
            this.start(percent, points, user_status);      
        } else { 
            this.stop();
            this.clear();
        }
     }
}

//---- CANVAS INSTANCES ----
var centerIconCanvas, topIconCanvas;

//---- INIT CHART ----
const initChart = () => {
    var images = {
        star: "svg/star.svg",
        silver: "svg/silver.svg",
        gold: "svg/gold.svg",
        platinum: "svg/platinum.svg",
        diamond: "svg/diamond.svg"
    }
    var colors = {
        star: ["#616468", "#f8f8f8", "#606367"],
        silver: ["#616468", "#f8f8f8", "#606367"],
        gold: ["#f1cb55"],
        platinum: ["#616468", "#f8f8f8", "#606367"],
        diamond: ["#000000"]
    };
    var center1 = {
        xPos: 50,
        yPos: 50
    };
    var center2 = {
        xPos: 50,
        yPos: 100
    };
    var radius = 42;
    var lineWidth = 10;
    var percent = 50;
    var points = 500;
    var user_status = "star";

    topIconCanvas = new Canvas("topIconCanvas", colors, images, center2, radius, lineWidth, "top");
    topIconCanvas.start(percent, points, user_status);   

    centerIconCanvas = new Canvas("centerIconCanvas", colors, images, center1, radius, lineWidth, "center"); 
    centerIconCanvas.start(percent, points, user_status);
}


//---- User Action Handers ----

var input = document.getElementById("point"); // Getting the input value for test purposes
input.addEventListener("keydown", (event) => {
   // Restricting all keys that are not numeric keys in testing
   if (event.key == "Backspace" || event.key == "Delete") return;
   if (!/[0-9]/.test(event.key) || input.value.length > 4)
      event.preventDefault();
});

// button CLick Action Handler
const increase = () => {
    var points = Number(input.value);
    centerIconCanvas.setPointsAndStart(points);
    topIconCanvas.setPointsAndStart(points);
};