$(document).ready(function () {
  // Display connection form
  $(".connection-ul").on("click", ".connection", function (e) {
    console.log("queue");
    $(".form").css("display", "block");
    $("body").css("overflowY", "hidden");
    $(".home").css("filter", "blur(6px)");
    $(".discs").css("filter", "blur(6px)");
    $(".shows").css("filter", "blur(6px)");
    $(".artist").css("filter", "blur(6px)");
    $(".blog").css("filter", "blur(6px)");
    $(".main-ctnr").css("filter", "blur(6px)");
  });

  // Remove connection form
  $(".back").on("click", function () {
    $(".register-form")[0].reset();
    $(".login-form")[0].reset();
    $(".form").css("display", "none");
    $("body").css("overflowY", "auto");
    $(".home").css("filter", "blur(0px)");
    $(".discs").css("filter", "blur(0px)");
    $(".shows").css("filter", "blur(0px)");
    $(".artist").css("filter", "blur(0px)");
    $(".blog").css("filter", "blur(0px)");
    $(".main-ctnr").css("filter", "blur(0px)");
  });

  // Switch form animation
  $(".message a").click(function () {
    $("form").animate({ height: "toggle", opacity: "toggle" }, "slow");
    $(".register-mail").css("border", "none");
    $(".register-password").css("border", "none");
    $(".confirm-register-password").css("border", "none");
    $(".register-mail").attr("placeholder", "adresse email");
    $(".register-password").attr("placeholder", "mot de passe");
    $(".confirm-register-password").attr(
      "placeholder",
      "confirmer mot de passe"
    );
    $(".login-mail").css("border", "none");
    $(".login-password").css("border", "none");
    $(".login-mail").attr("placeholder", "adresse email");
    $(".login-password").attr("placeholder", "mot de passe");
  });

  // Create account
  $(".register-form").on("submit", function (e) {
    e.preventDefault();
    const mail = $(".register-mail").val().trim();
    const password = $(".register-password").val().trim();
    const verifPassword = $(".confirm-register-password").val().trim();

    const error = [];

    if (mail < 1) {
      $(".register-mail").css("border", "1px solid red");
      $(".register-mail").attr("placeholder", "Veuillez remplir ce champ");
      error.push(mail);
    } else {
      $(".register-mail").css("border 1px", "black");
    }

    if (password < 1) {
      error.push(password);
      $(".register-password").css("border", "1px solid red");
      $(".register-password").attr("placeholder", "Veuillez remplir ce champ");
    } else {
      $(".register-password").css("border 1px", "black");
    }

    if (verifPassword < 1) {
      error.push(verifPassword);
      $(".confirm-register-password").css("border", "1px solid red");
      $(".confirm-register-password").attr(
        "placeholder",
        "Veuillez remplir ce champ"
      );
    } else {
      $(".confirm-register-password").css("border 1px", "black");
    }

    if (password != verifPassword) {
      error.push(verifPassword);
      $(".confirm-register-password").css("border", "1px solid red");
      $(".confirm-register-password").attr(
        "placeholder",
        "Veuillez remplir ce champ"
      );
    } else {
      $(".confirm-register-password").css("border 1px", "black");
    }

    if (error.length === 0) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(mail, password)
        .then(function (result) {
          // Add data to cloudfirestore with data auth
          $(".register-form")[0].reset();
          $(".form").css("display", "none");
          $("body").css("overflowY", "auto");
          $(".home").css("filter", "blur(0px)");
          $(".discs").css("filter", "blur(0px)");
          $(".shows").css("filter", "blur(0px)");
          $(".artist").css("filter", "blur(0px)");
          $(".blog").css("filter", "blur(0px)");
          $(".main-ctnr").css("filter", "blur(0px)");

          firebase.auth().onAuthStateChanged(function (user) {
            const email = user.email;
            const uid = user.uid;
            // const displayName = user.displayName;
            // const emailVerified = user.emailVerified;
            // const photoURL = user.photoURL;
            // const isAnonymous = user.isAnonymous;
            // const providerData = user.providerData;

            if (user) {
              // Database Connect
              const usersRef = firebase.firestore().collection("users");

              // add to the users database
              usersRef.doc(uid).set({
                mail: email,
                grade: "user",
              });
            }
          });
        })
        .catch(function (error) {
          // Handle Errors here.
          const errorCode = error.code;

          switch (errorCode) {
            case "auth/invalid-email":
              $(".register-mail").val("");
              $(".register-mail").css("border", "1px solid red");
              $(".register-mail").attr(
                "placeholder",
                "Veuillez entrer un mail valide"
              );
              break;
            case "auth/email-already-in-use":
              $(".register-mail").val("");
              $(".register-mail").css("border", "1px solid red");
              $(".register-mail").attr("placeholder", "Ce mail existe déjà");
              break;
            case "auth/weak-password":
              $(".register-password").val("");
              $(".confirm-register-password").val("");
              $(".register-password").css("border", "1px solid red");
              $(".register-password").attr(
                "placeholder",
                "mot de passe trop court (6 caractères min)"
              );
              break;

            default:
              break;
          }
        });
    }
  });

  // Connect account
  $(".login-form").on("submit", function (e) {
    e.preventDefault();
    const mail = $(".login-mail").val().trim();
    const password = $(".login-password").val().trim();

    const error = [];

    if (mail < 1) {
      $(".login-mail").css("border", "1px solid red");
      $(".login-mail").attr("placeholder", "Veuillez remplir ce champ");
      error.push(mail);
    } else {
      $(".login-mail").css("border", "none");
    }

    if (password < 1) {
      error.push(password);
      $(".login-password").css("border", "1px solid red");
      $(".login-password").attr("placeholder", "Veuillez remplir ce champ");
    } else {
      $(".login-password").css("border", "none");
    }

    if (error.length === 0) {
      firebase
        .auth()
        .signInWithEmailAndPassword(mail, password)
        .then(function (result) {
          $(".login-form")[0].reset();
          $(".form").css("display", "none");
          $("body").css("overflowY", "auto");
          $(".home").css("filter", "blur(0px)");
          $(".discs").css("filter", "blur(0px)");
          $(".shows").css("filter", "blur(0px)");
          $(".artist").css("filter", "blur(0px)");
          $(".blog").css("filter", "blur(0px)");
          $(".main-ctnr").css("filter", "blur(0px)");
        })
        .catch(function (error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);

          switch (errorCode) {
            case "auth/user-not-found":
              $(".login-mail").val("");
              $(".login-mail").css("border", "1px solid red");
              $(".login-mail").attr("placeholder", "mail incorrect");
              break;
            case "auth/wrong-password":
              $("login-password").val("");
              $("login-password").css("border", "1px solid red");
              $("login-password").attr("placeholder", "mot de passe incorrect");
              break;

            default:
              break;
          }
        });
    }
  });

  // Display connected user
  firebase.auth().onAuthStateChanged(function (user) {
    var currentUserConnected = firebase.auth().currentUser;

    if (currentUserConnected != null) {
      uid = user.uid;

      const userRef = firebase.firestore().collection("users").doc(uid);

      userRef.get().then(function (doc) {
        $(".connection-ul li").remove();
        $(".connection-ul").append(
          `<li><a class="current-user" href="#"><i class="fas fa-sign-out-alt signout-icon"></i>   ${
            doc.data().mail
          }</a></li>`
        );
      });
    }
  });

  // Disconnect user
  $(".connection-ul").on("click", ".current-user", function (e) {
    e.preventDefault();
    const DiscoConfirm = confirm("Voulez-vous vous déconnecter ?");
    if (DiscoConfirm == true) {
      firebase
        .auth()
        .signOut()
        .then(function () {
          $(".register-form")[0].reset();
          $(".login-form")[0].reset();
          $(".connection-ul li").remove();
          $(".add-icon").remove();
          $(".connection-ul").append(
            `<li><a class="connection" href="#"><i class="fas fa-sign-in-alt"></i>   Connexion</a></li>`
          );
        })
        .catch(function (error) {
          // An error happened.
        });
    }
  });
});
