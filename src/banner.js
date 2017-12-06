var BANNER = null;
var Banner = function() {
    this.bannerContents = [];
    this.animationSpeed = 17;
    this.bannerSeparation = 500;
    this.mustAnimate = true;
};

Banner.prototype.initBanner = function(data) {
    var banner = $("div#banner");

    var bannerOffsetX = this.bannerSeparation;
    for (var i = 0; i < data.projects.length; ++i) {
        var bannerContent = this.getBannerContent(data.projects[i]);
        bannerContent.style.left = bannerOffsetX + "px";
        banner.append(bannerContent);
        this.bannerContents.push(bannerContent);
        bannerOffsetX += this.bannerSeparation;
    }

    setInterval(this.animateBanner, this.animationSpeed);

    banner.mouseover(function() {
        BANNER.mustAnimate = false;
    });

    banner.mouseout(function() {
        BANNER.mustAnimate = true;
    });
};

Banner.prototype.getBannerContent = function(data) {
    var content = document.createElement('p');
    content.className = 'banner-data';
    content.innerHTML = '<span style="text-decoration: underline; cursor:pointer;" id="btn-banner-' + data.Project_ID + '" onclick="APP.onBannerProjectClicked(this.id)">' + data.Project_ID + '</span>';
    
    if (data.Project_Name != null && data.Project_Name != undefined) {
        content.innerHTML += ' - ' + data.Project_Name;        
    }

    if (data.Contact_Name != null && data.Contact_Name != undefined) {
        content.innerHTML += ' - ' + data.Contact_Name;        
    }

    return content;
};

Banner.prototype.animateBanner = function() {
    if (!BANNER.mustAnimate) {
        return;
    }

    for (var i = 0; i < BANNER.bannerContents.length; ++i) {
        var content = BANNER.bannerContents[i];
        var left = parseInt(content.style.left) - 1;

        if (left < -content.clientWidth) {
            content.style.left = left + content.clientWidth * BANNER.bannerContents.length + "px";
        }
        else {
            content.style.left = left + "px";            
        }
    }
};
