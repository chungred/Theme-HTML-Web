// /////
// Darkbox by Roko.CB
(function () {

    var c = 0; // counter
    var $images = {};
    var n = 0;
    var $prevNext = $("<div id='darkbox_prev'/><div id='darkbox_next'/>").on("click", function (e) {
        e.stopPropagation();
        var isNext = this.id === "darkbox_next";
        c = (isNext ? c++ : --c) < 0 ? n - 1 : c % n;
        $images.eq(c).click();
    });
    var $darkboxDescription = $("<div/>", {
        "id": "darkbox-description"
    });
    var $darkbox = $("<div/>", {
        "id": "darkbox",
        html: $prevNext
    }).on("click", function () {
        $(this).removeClass("on");
    }).append($darkboxDescription).appendTo("body");

    $(document).on("click", "[data-darkbox]", function (e) {

        e.preventDefault();
        e.stopPropagation();

        $images = $('[data-darkbox!=""][data-darkbox]');
        n = $images.length;

        var that = this;
        var docW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var docH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var o = this.getBoundingClientRect();
        var imgSRC = this.dataset.darkbox ? this.dataset.darkbox : this.src;
        if (!imgSRC)
            imgSRC = $("[data-darkbox!=''][data-darkbox]").attr("data-darkbox");
        var newImg = new Image();
        newImg.onload = function () {
            c = $images.index(that);
            var bigger = (newImg.height > docH || newImg.width > docW);
            $darkbox.css({// Init darkbox to image position
                backfaceVisibility: "hidden",
                transition: "0s",
                backgroundImage: "url('" + newImg.src + "')",
                backgroundSize: bigger ? "contain" : "auto",
                left: o.left,
                top: o.top,
                height: that.height,
                width: that.width
            });
            $darkboxDescription.html($(that).attr("data-darkbox-description"));
            setTimeout(function () {
                if (!$darkbox.hasClass("on")) {
                    $darkbox.css({transition: "0.8s"}).addClass("on");
                }
            }, 35);
        };
        newImg.src = imgSRC;

    });

    $(document).on("keyup", function (e) {
        var k = e.which;
        if (k === 27) /*ESC */
            $("#darkbox").click(); // close Darkbox
        if (k === 37) /*LEFT*/
            $("#darkbox_prev").click();
        if (k === 39) /*RIGHT*/
            $("#darkbox_next").click();
    });

}());