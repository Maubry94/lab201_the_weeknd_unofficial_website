$(document).ready(function () {
  $(".newsletter_button").on("click", function () {
    if ($(".newsletter_input").val() != "") {
      alert("Prochainement.");
    }
  });
});
