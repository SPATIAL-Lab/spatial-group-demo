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
};

Banner.prototype.initBanner = function() {
    var banner = $("div#banner");

    var bannerContent = this.getBannerContent({"ProjectID" : "00113", "Site" : "S Ontario GW", "Citation": "Ontario MNDM"});
    banner.append(bannerContent);
    this.bannerContents.push(bannerContent);

    bannerContent = this.getBannerContent({"ProjectID" : "00112", "Site" : "Wen Bangong Lake", "Citation": "Rong Wen"});
    banner.append(bannerContent);
    this.bannerContents.push(bannerContent);
    
    bannerContent = this.getBannerContent({"ProjectID" : "00111", "Site" : "Isotope Hydro of Hawaii", "Citation": "Martha Scholl"});
    banner.append(bannerContent);
    this.bannerContents.push(bannerContent);
};

Banner.prototype.getBannerContent = function(data) {
    var contentString = '<p class="banner-data">';
    contentString += '<span style="text-decoration: underline; cursor:pointer;" id="btn-banner-' + data.ProjectID + '" onclick="APP.onBannerProjectClicked(this.id)">' + data.ProjectID + '</span>';
    contentString += ' - ' + data.Site;
    contentString += ' - ' + data.Citation;
    contentString += '</p>';
    return contentString
};

Banner.prototype.onProjectClicked = function(projectID) {

};
