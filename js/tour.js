$(document).ready(function () {
  const tourRef = firebase.database().ref("tour/");
  const usersRef = firebase.firestore().collection("users");

  // Check if user is an admin
  firebase.auth().onAuthStateChanged(function (user) {
    const email = user.email;
    const uid = user.uid;
    // const displayName = user.displayName;
    // const emailVerified = user.emailVerified;
    // const photoURL = user.photoURL;
    // const isAnonymous = user.isAnonymous;
    // const providerData = user.providerData;

    $(".tour").remove();

    // Database Connect
    usersRef
      .doc(uid)
      .get()
      .then(function (doc) {
        if (doc.data().grade == "admin") {
          $(".section_title").append(
            `<div class="add-icon-ctnr"><i class="fas fa-plus add-icon"><span class="tips">Ajouter une date</span></div>`
          );
          $(".icons").css("display", "flex");

          // Read tours in database ADMIN
          tourRef.on("value", function (snapshot) {
            let content = "";
            snapshot.forEach(function (item) {
              content += `
                      <li
                    class="d-flex flex-row align-items-center justify-content-start"
                  >
                  <div class="icons">
                    <i class="far fa-edit edit-icon ${item.key}"></i>
                    <i class="far fa-trash-alt delete-icon ${item.key}"></i>
                  </div>

                    <div><div class="show_date">${item.val().date}</div></div>
                    <div
                      class="show_info d-flex flex-md-row flex-column align-items-md-center align-items-start justify-content-md-start justify-content-center"
                    >
                      <div class="show_name">
                        <a href="#">${item.val().city}</a>
                      </div>
                      <div class="show_location">${item.val().place}</div>
                    </div>
                    <div class="ml-auto">
                      <div class="show_shop trans_200">
                        <a href="#">Acheter Tickets</a>
                      </div>
                    </div>
                  </li>
                      `;
              $(".shows_list").html(content);
            });
          });
        } else {
          // Read tours in database USER LOGGED
          tourRef.on("value", function (snapshot) {
            let content = "";
            snapshot.forEach(function (item) {
              content += `
                      <li
                    class="d-flex flex-row align-items-center justify-content-start"
                  >
                    <div><div class="show_date">${item.val().date}</div></div>
                    <div
                      class="show_info d-flex flex-md-row flex-column align-items-md-center align-items-start justify-content-md-start justify-content-center"
                    >
                      <div class="show_name">
                        <a href="#">${item.val().city}</a>
                      </div>
                      <div class="show_location">${item.val().place}</div>
                    </div>
                    <div class="ml-auto">
                      <div class="show_shop trans_200">
                        <a href="#">Acheter Tickets</a>
                      </div>
                    </div>
                  </li>
                      `;
              $(".shows_list").html(content);
            });
          });
        }
      });
  });

  // Read tours in database VISITOR
  tourRef.on("value", function (snapshot) {
    let content = "";
    snapshot.forEach(function (item) {
      content += `
              <li
            class="d-flex flex-row align-items-center justify-content-start tour"
          >
            <div><div class="show_date">${item.val().date}</div></div>
            <div
              class="show_info d-flex flex-md-row flex-column align-items-md-center align-items-start justify-content-md-start justify-content-center"
            >
              <div class="show_name">
                <a href="#">${item.val().city}</a>
              </div>
              <div class="show_location">${item.val().place}</div>
            </div>
            <div class="ml-auto">
              <div class="show_shop trans_200">
                <a href="#">Acheter Tickets</a>
              </div>
            </div>
          </li>
              `;
      $(".shows_list").html(content);
    });
  });

  let addForm = false;

  // Create add-tour-form
  $(".section_title").on("click", ".add-icon", function (e) {
    if (addForm == false) {
      $(".shows").append(
        `
          <div class="add-tour-form">
            <form>
              <p>Date :</p>
              <input class="add-date"
                type="text"
                name="add-date"
                require
              />
              <p>Ville :</p>
              <input class="add-city"
                type="text"
                name="add-city"
                require
              />
              <p>Lieu :</p>
              <input class="add-place"
                type="text"
                name="add-place"
                require
              />
              <input type="submit" class="add-tour" value="Ajouter">
              <br>
              <a class="back" href="#">< Retour</a></Retour>
            </form>
          </div>
        `
      );
      $(".container").css("filter", "blur(6px)");
      $("body").css("overflowY", "hidden");
      addForm = true;
    }
  });

  // Add tour in database
  $(".shows").on("submit", ".add-tour-form", function (e) {
    e.preventDefault();

    const date = $(".add-date").val().trim();
    const city = $(".add-city").val().trim();
    const place = $(".add-place").val().trim();

    const error = [];

    if (date < 1) {
      $(".add-date").css("border", "1px solid red");
      $(".add-date").attr("placeholder", "Veuillez remplir ce champ");
      error.push(date);
    } else {
      $(".add-date").css("border 1px", "black");
    }

    if (city < 1) {
      $(".add-city").css("border", "1px solid red");
      $(".add-city").attr("placeholder", "Veuillez remplir ce champ");
      error.push(city);
    } else {
      $(".add-city").css("border 1px", "black");
    }

    if (place < 1) {
      $(".add-place").css("border", "1px solid red");
      $(".add-place").attr("placeholder", "Veuillez remplir ce champ");
      error.push(place);
    } else {
      $(".add-place").css("border 1px", "black");
    }

    if (error.length === 0) {
      tourRef.push({
        date: date,
        city: city,
        place: place,
      });

      $(".add-tour-form").remove();
      $(".container").css("filter", "blur(0px)");
      $("body").css("overflowY", "auto");
      addForm = false;
    }
  });

  let editForm = false;
  let itemKey = "";

  // Edit tour
  tourRef.on("value", function (snapshot) {
    snapshot.forEach(function (item) {
      $(".shows").on("click", ".edit-icon" + "." + item.key, function (event) {
        if (editForm == false) {
          itemKey = item.key;
          $(".shows").append(
            `
              <div class="edit-tour-form">
                <form>
                  <p>Date :</p>
                  <input class="edit-date"
                    type="text"
                    name="edit-date"
                    value=""
                    required
                  />
                  <p>Ville :</p>
                  <input class="edit-city"
                    type="text"
                    name="edit-city"
                    value=""
                    required
                  />
                  <p>Lieu :</p>
                  <input class="edit-place"
                    type="text"
                    name="edit-place"
                    value=""
                    required
                  />
                  <input type="submit" class="edit-tour" value="Modifier">
                  <br>
                  <a class="back" href="#">< Retour</a></Retour>
                </form>
              </div>
            `
          );
          $(".container").css("filter", "blur(6px)");
          $("body").css("overflowY", "hidden");
          editForm = true;
        }
      });
    });
  });

  // Update
  $(".shows").on("submit", ".edit-tour-form", function (e) {
    e.preventDefault();

    const date = $(".edit-date").val().trim();
    const city = $(".edit-city").val().trim();
    const palce = $(".edit-place").val().trim();

    const error = [];

    if (date < 1) {
      $(".edit-date").css("border", "1px solid red");
      $(".edit-date").attr("placeholder", "Veuillez remplir ce champ");
      error.push(date);
    } else {
      $(".edit-date").css("border 1px", "black");
    }

    if (city < 1) {
      $(".edit-city").css("border", "1px solid red");
      $(".edit-city").attr("placeholder", "Veuillez remplir ce champ");
      error.push(city);
    } else {
      $(".edit-city").css("border 1px", "black");
    }

    if (palce < 1) {
      $(".edit-place").css("border", "1px solid red");
      $(".edit-place").attr("placeholder", "Veuillez remplir ce champ");
      error.push(palce);
    } else {
      $(".edit-place").css("border 1px", "black");
    }

    if (error.length === 0) {
      firebase
        .database()
        .ref("tour/" + itemKey)
        .update({
          date: date,
          city: city,
          place: palce,
        });
      $(".edit-tour-form").remove();
      $(".container").css("filter", "blur(0px)");
      $("body").css("overflowY", "auto");
      editForm = false;
      itemKey = "";
    }
  });

  // Remove add-tour-form & edit-tour-form
  $(".shows").on("click", ".back", function (e) {
    $(".add-tour-form").remove();
    $(".edit-tour-form").remove();
    $(".container").css("filter", "blur(0px)");
    $("body").css("overflowY", "auto");
    addForm = false;
    editForm = false;
  });

  // Delete tour
  tourRef.on("value", function (snapshot) {
    snapshot.forEach(function (item) {
      $(".shows").on("click", ".delete-icon" + "." + item.key, function (
        event
      ) {
        firebase
          .database()
          .ref("tour/" + item.key)
          .remove();
      });
    });
  });
});
