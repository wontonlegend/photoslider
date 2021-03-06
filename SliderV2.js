//var imageList = ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/2000px-Star_Wars_Logo.svg.png", "https://upload.wikimedia.org/wikipedia/en/4/40/Star_Wars_Phantom_Menace_poster.jpg", "http://vignette3.wikia.nocookie.net/starwars/images/2/24/EPII_AotC_poster.png/revision/latest?cb=20130822173923", "http://ia.media-imdb.com/images/M/MV5BNTc4MTc3NTQ5OF5BMl5BanBnXkFtZTcwOTg0NjI4NA@@._V1_SX640_SY720_.jpg", "http://spinoff.comicbookresources.com/wp-content/uploads/2014/06/anewhopeposter.jpg", "http://vignette3.wikia.nocookie.net/starwars/images/e/e4/Empire_strikes_back_old.jpg/revision/latest?cb=20061201083417", "https://upload.wikimedia.org/wikipedia/en/b/b2/ReturnOfTheJediPoster1983.jpg", "http://ia.media-imdb.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX640_SY720_.jpg"];
var pos = 0;
var timeout = 500;
var imageEL = "#image1";
var nextimg = "#image3";
var previousimg = "#image2";
var slideIntervalFast = 5000;
var slideIntervalNorm = 7500;
var slideIntervalSlow = 10000;
var interval;
var DataRef = new Firebase('https://fotoslider.firebaseio.com/');
var dotinit = false;
var imageList = [];

DataRef.on("value", function(snapshot) {
    var snap = snapshot.val();
    console.log(snap.imagelist);
    imageList = snap.imagelist;
    initdots();

});

var nextpos = 1;
var prevpos = imageList.length - 1;

$(document).ready(function() {
    //right button click bind
    $("#rightbutton").click(function() {
        slideImgRight();
        //resetSlideshow();
        playSlideshow();
    });
    $(document).keydown(function(event) {
        if(event.which === 39){
            slideImgRight();
        }
        //resetSlideshow();
        playSlideshow();
    });

    // left button click bind
    $("#leftbutton").click(function() {
        slideImgLeft();
        pauseSlideshow();
    });
    $(document).keydown(function(event) {
        if (event.which === 37) {
            slideImgLeft();
            pauseSlideshow();
        }
    });
    // submit button bind
    $("#submitbutton").click(function() {
        addurl();
        pauseSlideshow();
    });
    $("#pause").click(function() {
        pauseSlideshow();
    });
    $("#play").click(function() {
        playSlideshow();
    });

    bindBackground();

    playSlideshow();

    menunav();

    deletePhoto();

    savesettings();

    $("#fsclick2").hide();

    $("#fsclick").click(function() {
        gofullscreen();
    });

    $("#fsclick2").click(function(){
        exitfullscreen();
    });
    mouseoverimages();
    //DataRef.child("imagelist").set(imageList);

});
function gofullscreen() {
    $("#image1").css({"height":900,"width":800,"z-index":2});
    document.getElementById("border").style.backgroundImage = "url(http://img.lum.dolimg.com/v1/images/Hoth_d074d307.jpeg?region=0%2C0%2C1200%2C675&width=768)";

    $("#fsclick").hide();
    $("#fsclick2").show()
}

function exitfullscreen() {
    $("#image1").css({'height': 515,
        'width':450,
        'margin-top': '1%',
        'margin-bottom': '3%;'});
    document.getElementById("border").style.backgroundImage = "url(http://img.lum.dolimg.com/v1/images/Hoth_d074d307.jpeg?region=0%2C0%2C1200%2C675&width=768)";

    $("#fsclick").show();
    $("#fsclick2").hide()

}

function mouseoverimages() {
    $(previousimg).hide();

    $(nextimg).hide();

    $("#leftbutton").mouseover(function () {
        $(previousimg).fadeIn()
    });
    $("#leftbutton").mouseout(function () {
        $(previousimg).fadeOut()
    });

    $("#rightbutton").mouseover(function () {
        $(nextimg).fadeIn()
    });
    $("#rightbutton").mouseout(function () {
        $(nextimg).fadeOut()
    });
}

function initdots() {
    if (dotinit === false) {
        //create dots
        for (var i = 0; i<imageList.length; i++) {
            var dot = document.createElement("div");
            $(dot).addClass("dotprop");
            $(dot).attr("id", i);
            $("#dots").append(dot);
        }
        dotNavigation();
        //dot click bind
        dotBind();
        listinit = true;
    }
    dotinit = true;
}

function slideImgRight() {
    $(imageEL).hide("slide", {direction: "left"}, "slow");
    pos+=1;
    if (pos>imageList.length - 1) {
        pos=0;
    }
    setTimeout(function() {
        console.log("right button 2, pos="+pos);
        $(imageEL).attr("src", imageList[pos]);
        dotNavigation();
    }, timeout);
    //$(imageEL).show("slide", {direction: "right"}, "slow");
    $(imageEL).fadeIn("slow");
    shownextimg();
}

function shownextimg() {
    nextpos+=1;
    prevpos += 1;
    if (nextpos>imageList.length - 1) {
        nextpos = 0;
    }
    if (prevpos>imageList.length - 1) {
        prevpos = 0;
    }
    $(previousimg).attr("src", imageList[prevpos]);
    $(nextimg).attr("src", imageList[nextpos]);
}

function showprevimg() {
    prevpos -= 1;
    nextpos -= 1;
    if (prevpos < 0) {
        prevpos = imageList.length - 1;
    }
    if (nextpos < 0) {
        nextpos = imageList.length - 1;
    }
    $(previousimg).attr("src", imageList[prevpos]);
    $(nextimg).attr("src", imageList[nextpos]);

}


function slideImgLeft() {
    console.log("left button 1, pos="+pos);
    $(imageEL).hide("slide", {direction: "right"}, "slow");

    pos -= 1;
    if (pos<0) {
        pos=imageList.length - 1;
    }
    setTimeout(function() {
        console.log("left button 2, pos="+pos);
        $(imageEL).attr("src", imageList[pos]);
        //$(imageEL).show("slide", {direction: "left"}, "slow");
        dotNavigation();
    }, timeout);
    $(imageEL).fadeIn("slow");
    showprevimg();



}

//change dot to the current position
function dotNavigation() {
    $(".dotprop").fadeTo("fast", 0.5);
    $("#" + pos).fadeTo("fast", 1);


}

function dotBind() {
    $(".dotprop").unbind("click");
    $(".dotprop").click(function(e) {
        $(imageEL).fadeOut("slow");
        pos = parseInt($(e.target).attr("id"));
        nextpos = pos + 1;
        prevpos = pos - 1;
        $(previousimg).attr("src", imageList[prevpos]);
        $(nextimg).attr("src", imageList[nextpos]);
        setTimeout(function() {
            $(imageEL).attr("src", imageList[pos]);
            $(imageEL).fadeIn("slow");
        }, timeout);
        dotNavigation();
        //pauseSlideshow();
        playSlideshow();

    });
}

function bindBackground() {
    $("#hoth").fadeTo("slow", 0.5);
    $("#hoth").click(function() {
        document.getElementById("border").style.backgroundImage = "url(http://img.lum.dolimg.com/v1/images/Hoth_d074d307.jpeg?region=0%2C0%2C1200%2C675&width=768)";
        $("#hoth").fadeTo("fast", 0.5);
        $("#endo").fadeTo("fast", 1);
        $("#tant").fadeTo("fast", 1);
    });
    $("#tant").click(function() {
        document.getElementById("border").style.backgroundImage = "url(http://img.lum.dolimg.com/v1/images/open-uri20150608-27674-obj7u0_7c60f729.jpeg?region=0%2C0%2C1200%2C513)";
        $("#tant").fadeTo("fast", 0.5);
        $("#endo").fadeTo("fast", 1);
        $("#hoth").fadeTo("fast", 1);
    });
    $("#endo").click(function() {
        document.getElementById("border").style.backgroundImage = "url(http://bi9he1w7hz8qbnm2zl0hd171.wpengine.netdna-cdn.com/wp-content/uploads/2015/04/Star-Wars-Battlefront.jpg)";
        $("#endo").fadeTo("fast", 0.5);
        $("#hoth").fadeTo("fast", 1);
        $("#tant").fadeTo("fast", 1);
    });
}

function addurl() {
    if (document.getElementById("userurl").value === "") {
        alert("No URL entered!")
    }
    else {
        imageList.push(document.getElementById("userurl").value);
        pos = imageList.length - 1;
        nextpos = 0;
        prevpos = imageList.length - 2;
        var dot = document.createElement("div");
        $(dot).addClass("dotprop");
        $(dot).attr("id", imageList.length - 1);
        $("#dots").append(dot);
        $(imageEL).fadeOut("slow");
        setTimeout(function() {
            $(imageEL).attr("src", document.getElementById("userurl").value);
            $(imageEL).fadeIn("slow");
        }, timeout);
        dotBind();
        dotNavigation();
    }
    DataRef.update({imagelist: imageList});
}


function deletePhoto() {
    $("#deletephotobtn").click(function() {
        imageList.splice(pos, 1);
        $(".dotprop").remove();
        dotinit = false;
        initdots();
        slideImgRight();
        shownextimg();
        dotNavigation();
        DataRef.update({imagelist: imageList});
    });
}

function clear() {
    interval = clearInterval(interval);
}

function pauseSlideshow() {
    clear();
    $("#pause").hide();
    $("#play").show();
    $("#cantinasong")[0].pause();
}

function playSlideshow() {
    var slideIntervalValue = $("#slidetimes").val();
    clear();
    if (slideIntervalValue === "Fast") {
        interval = window.setInterval(function () {
            slideImgRight();}, slideIntervalFast);
    }
    if (slideIntervalValue === "Normal") {
        interval = window.setInterval(function () {
            slideImgRight();}, slideIntervalNorm);
    }
    if (slideIntervalValue === "Slow") {
        interval = window.setInterval(function () {
            slideImgRight();}, slideIntervalSlow);
    }

    $("#play").hide();
    $("#pause").show();
    $("#cantinasong")[0].play();
}

function menunav() {
    $("#generalarea").hide();
    $("#generalpg").click(function () {
        $("#border").hide();
        $("#submitphotoarea").hide();
        $("#generalarea").show();
        pauseSlideshow();
    });
    $("#photopg").click(function() {
        $("#generalarea").hide();
        $("#submitphotoarea").show();
        $("#border").show();
        playSlideshow();
    });
}


function savesettings() {
    $("#savebutton").click(function () {
        $("#generalarea").hide();
        $("#submitphotoarea").show();
        $("#border").show();
        playSlideshow();
    });

}