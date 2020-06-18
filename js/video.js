var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "315",
    width: "560",
    videoId: "POHOu4ivYNY",
    events: {
      onReady: function () {
        $(".video-thumb").click(function () {
          console.log("click");
          var $this = $(this);
          if (!$this.hasClass("active")) {
            player.cueVideoById($this.attr("data-video"));
            $this.addClass("active").siblings().removeClass("active");
            $(".selection").remove();
            $this.append(
              '<div class="selection"><i class="far fa-play-circle play"></i></div>'
            );
          }
        });
      },
    },
  });
}
