(function() {
    
    var insertYoutubeVideo = function (video) {

        var flashPlayerVersion = swfobject.getFlashPlayerVersion();

        if(!flashPlayerVersion.major && !flashPlayerVersion.minor && !flashPlayerVersion.release) {
            $("#" + video.htmlElementId).html("<div class='missing-flash'>Flash player isn't installed.</div>");
            var linkToAdobeFlash = $("<a />").text("Install Adobe Flash Player")
                                             .attr("href", "http://get.adobe.com/flashplayer/")
                                             .attr("target", "_blank");
            $(".missing-flash").append(linkToAdobeFlash);
            return;
        }

        var params = {
            allowScriptAccess: "always"
        };
        var atts = {
            id: video.htmlElementId
        };
        swfobject.embedSWF("http://www.youtube.com/v/" + video.id + "?enablejsapi=1&playerapiid=ytplayer&version=3",
                           video.htmlElementId, video.width, video.height, video.flashPlayerVersion, null, null, params, atts);
    };

    var getFullAddressOfStore = function (address) {
        return address.Address1 + " " + address.City + ", " + address.StateProvince + " " + address.Postcode;
    };

    var formatTimeSpan = function(startDate) {
        var startDateTimeStamp = startDate.getTime(),
            nowDateTimeStamp = new Date().getTime(),
            one_day = 1000 * 60 * 60 * 24,
            one_hour = 1000 * 60 * 60,
            one_minute = 1000 * 60;

        var diffInDay = Math.floor((nowDateTimeStamp - startDateTimeStamp) / one_day),
            diffInHours = Math.floor((nowDateTimeStamp - startDateTimeStamp) / one_hour),
            diffInMinutes = Math.ceil((nowDateTimeStamp - startDateTimeStamp) / one_minute);

        if(diffInDay === 0) {
            if(diffInHours > 0) {
                return diffInHours + " hours ago"
            }
            else {
                if(diffInMinutes > 0) {
                    return diffInMinutes + " minutes ago";
                }
                else {
                    return "Now";
                }
            }
        }
        if(diffInDay < 7) {
            return diffInDay + " days ago";
        }
        if(diffInDay < 31) {
            return Math.floor(diffInDay / 7) + " weeks ago";
        }

        if(diffInDay < 365) {
            return Math.floor(diffInDay / 31) + " months ago";
        }

        return diffInDay;
    };

    var getPersonFullName = function(person) { 
        return person.Name + ' ' + person.Surname;
    };

    var notImplemented = function() {
        alert("Not implemented for the demo");
    };

    window.DXSK8Shared = {
        utils: {
            insertYoutubeVideo: insertYoutubeVideo,
            getFullAddressOfStore: getFullAddressOfStore,
            formatTimeSpan: formatTimeSpan,
            getPersonFullName: getPersonFullName,
            notImplemented: notImplemented
        }
    };

})();