/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Menu
4. Firebase


******************************/

$(document).ready(function () {
  "use strict";

  /* 

	1. Vars and Inits

	*/

  var header = $(".header");
  var ctrl = new ScrollMagic.Controller();
  const usersRef = firebase.firestore().collection("users");
  const blogRef = firebase.database().ref("blog/");
  const storageRef = firebase.storage().ref();

  initMenu();

  setHeader();

  $(window).on("resize", function () {
    setHeader();
  });

  $(document).on("scroll", function () {
    setHeader();
  });

  /* 

	2. Set Header

	*/

  function setHeader() {
    if ($(window).scrollTop() > 91) {
      header.addClass("scrolled");
    } else {
      header.removeClass("scrolled");
    }
  }

  /* 

	3. Init Menu

	*/

  function initMenu() {
    if ($(".menu").length) {
      var hamb = $(".hamburger");
      var menu = $(".menu");
      var menuOverlay = $(".menu_overlay");

      hamb.on("click", function () {
        menu.addClass("active");
      });

      menuOverlay.on("click", function () {
        menu.removeClass("active");
      });
    }
  }

  /* 

	2. Firebase

  */

  //Read articles
  blogRef.orderByChild("pushDate").on("value", function (snapshot) {
    snapshot.forEach(function (item) {
      let content = "";
      content += `
        <div class="blog_post">
              <div
                class="blog_post_date d-flex flex-column align-items-center justify-content-center"
              >
                <div>${item.val().day}</div>
                <div>${item.val().month}</div>
                <div>${item.val().year}</div>
              </div>
              <div class="blog_post_image">
                <img src="${item.val().image}" alt="" />
              </div>
              <div class="blog_post_title">
                <h2>
                  <a href="#">${item.val().title}</a>
                </h2>
              </div>
              <div class="blog_post_text">
                <p>
                  ${item.val().text}
                </p>
              </div>
            </div>
        `;
      $(".blog_posts").append(content);
    });
  });

  // Check if user is an admin
  firebase.auth().onAuthStateChanged(function (user) {
    const email = user.email;
    const uid = user.uid;
    // const displayName = user.displayName;
    // const emailVerified = user.emailVerified;
    // const photoURL = user.photoURL;
    // const isAnonymous = user.isAnonymous;
    // const providerData = user.providerData;

    // $(".tour").remove();

    // Database Connect
    usersRef
      .doc(uid)
      .get()
      .then(function (doc) {
        if (doc.data().grade == "admin") {
          $(".blog").prepend(
            `<div class="add-icon-ctnr"><i class="fas fa-plus add-icon"><span class="tips">Ajouter un article</span></div>`
          );
          // $(".icons").css("display", "flex");

          // Read tours in database ADMIN
          //   blogRef.on("value", function (snapshot) {
          //     let content = "";
          //     snapshot.forEach(function (item) {});
          //   });
          // } else {
          //   // Read tours in database USER LOGGED
          //   blogRef.on("value", function (snapshot) {
          //     let content = "";
          //     snapshot.forEach(function (item) {});
          //   });
        }
      });
  });

  let addForm = false;

  // Create add-tour-form
  $(".blog").on("click", ".add-icon", function (e) {
    if (addForm == false) {
      $(".container").append(
        `
          <div class="add-article-form">
            <form>
              <p>Date :</p>
              <div class="add-date-ctnr">
                <input class="add-day"
                type="text"
                name="add-day"
                placeholder="jour"
                require
                />
                <input class="add-month"
                type="text"
                name="add-month"
                placeholder="mois"
                require
                />
                <input class="add-year"
                type="text"
                name="add-year"
                placeholder="année"
                require
                />
              </div>
              
              <p>Titre :</p>
              <input class="add-title"
                type="text"
                name="add-title"
                require
              />
              <p>Texte :</p>
              <input class="add-text"
                type="text"
                name="add-text"
                require
              />
              <div class="form-group">
                  <label for="file">Fichier à télécharger :</label>
                  <input class="file" type="file" class="form-control-file" ">
              </div>
              <input type="submit" class="add-article" value="Ajouter">
              <br>
              <a class="back" href="#">< Retour</a></Retour>
            </form>
          </div>
        `
      );
      $(".blog_posts").css("filter", "blur(6px)");
      $("body").css("overflowY", "hidden");
      addForm = true;
    }
  });

  // Add tour in database
  $(".container").on("submit", ".add-article-form", function (e) {
    e.preventDefault();

    const day = $(".add-day").val().trim();
    const month = $(".add-month").val().trim();
    const year = $(".add-year").val().trim();
    const title = $(".add-title").val().trim();
    const text = $(".add-text").val().trim();

    const error = [];

    if (day < 1) {
      $(".add-day").css("border", "1px solid red");
      $(".add-day").attr("placeholder", "Veuillez remplir ce champ");
      error.push(day);
    } else {
      $(".add-day").css("border 1px", "black");
    }

    if (month < 1) {
      $(".add-month").css("border", "1px solid red");
      $(".add-month").attr("placeholder", "Veuillez remplir ce champ");
      error.push(month);
    } else {
      $(".add-month").css("border 1px", "black");
    }

    if (year < 1) {
      $(".add-year").css("border", "1px solid red");
      $(".add-year").attr("placeholder", "Veuillez remplir ce champ");
      error.push(year);
    } else {
      $(".add-year").css("border 1px", "black");
    }

    if (title < 1) {
      $(".add-title").css("border", "1px solid red");
      $(".add-title").attr("placeholder", "Veuillez remplir ce champ");
      error.push(title);
    } else {
      $(".add-title").css("border 1px", "black");
    }

    if (text < 1) {
      $(".add-text").css("border", "1px solid red");
      $(".add-text").attr("placeholder", "Veuillez remplir ce champ");
      error.push(text);
    } else {
      $(".add-text").css("border 1px", "black");
    }

    if (error.length === 0) {
      const file = $(".file").get(0).files[0];
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`${file.name}`).put(file);

      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        function (error) {},
        function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log("File available at", downloadURL);
            blogRef.push({
              day: day,
              month: month,
              year: year,
              title: title,
              text: text,
              image: downloadURL,
              pushDate: -Date.now(),
            });
          });
        }
      );

      $(".add-article-form").remove();
      $(".container").css("filter", "blur(0px)");
      $(".blog_posts").css("filter", "blur(0px)");
      $("body").css("overflowY", "auto");
      addForm = false;
    }
  });

  // Remove add-article-form & edit-article-form
  $(".container").on("click", ".back", function (e) {
    $(".add-article-form").remove();
    $(".edit-article-form").remove();
    $(".container").css("filter", "blur(0px)");
    $(".blog_posts").css("filter", "blur(0px)");
    $("body").css("overflowY", "auto");
    addForm = false;
    editForm = false;
  });

  // $(".file").on("change", onSelectFile);

  // function onSelectFile(event) {
  //   const file = event.target.files[0];
  //   const storageRef = firebase.storage().ref();
  //   const uploadTask = storageRef.child(`${file.name}`).put(file);

  //   uploadTask.on(
  //     "state_changed",
  //     function (snapshot) {
  //       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log("Upload is " + progress + "% done");
  //     },
  //     function (error) {},
  //     function () {
  //       uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
  //         console.log("File available at", downloadURL);
  //         blogRef.push({
  //           image: downloadURL,
  //         });
  //       });
  //     }
  //   );
  // }

  // let today = new Date();
  // const dd = String(today.getDate()).padStart(2, "0");
  // const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  // const yyyy = today.getFullYear();

  // today = dd + "/" + mm + "/" + yyyy;
  // console.log(today);
});
