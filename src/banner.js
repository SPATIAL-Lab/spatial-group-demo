/*

Recent datasets added:
00113    S Ontario GW     Ontario MNDM
00112    Wen Bangong Lake         Rong Wen
00111    Isotope Hydro of Hawaii               Martha Scholl

*/

var BANNER = null;
var Banner = function() {
    this.bannerContents = [];
    this.initBanner();

    this.animationSpeed = 1;
};

Banner.prototype.initBanner = function() {
    var banner = $("div#banner");

    var bannerContent = this.getBannerContent({"ProjectID" : "00113", "Site" : "S Ontario GW", "Citation": "Ontario MNDM"});
    bannerContent.style.left = "0px";
    banner.append(bannerContent);
    this.bannerContents.push(bannerContent);

    bannerContent = this.getBannerContent({"ProjectID" : "00112", "Site" : "Wen Bangong Lake", "Citation": "Rong Wen"});
    bannerContent.style.left = "400px";
    banner.append(bannerContent);
    this.bannerContents.push(bannerContent);
    
    bannerContent = this.getBannerContent({"ProjectID" : "00111", "Site" : "Isotope Hydro of Hawaii", "Citation": "Martha Scholl"});
    bannerContent.style.left = "800px";
    banner.append(bannerContent);
    this.bannerContents.push(bannerContent);

    setInterval(this.animateBanner, 17);
};

Banner.prototype.getBannerContent = function(data) {
    var content = document.createElement('p');
    content.className = 'banner-data';
    content.innerHTML = '<span style="text-decoration: underline; cursor:pointer;" id="btn-banner-' + data.ProjectID + '" onclick="APP.onBannerProjectClicked(this.id)">' + data.ProjectID + '</span>';
    content.innerHTML += ' - ' + data.Site;
    content.innerHTML += ' - ' + data.Citation;
    return content;
};

Banner.prototype.animateBanner = function() {
    for (var i = 0; i < BANNER.bannerContents.length; ++i) {
        var content = BANNER.bannerContents[i];
        var left = parseInt(content.style.left) - BANNER.animationSpeed;

        if (left < -content.clientWidth) {
            content.style.left = left + content.clientWidth * BANNER.bannerContents.length + "px";
        }
        else {
            content.style.left = left + "px";            
        }
    }
};
