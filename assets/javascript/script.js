(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA7U77MReGVp7JCl-TIm0znHpwtU4OLnc4",
        authDomain: "rock-paper-scissors-jfe.firebaseapp.com",
        databaseURL: "https://rock-paper-scissors-jfe.firebaseio.com",
        projectId: "rock-paper-scissors-jfe",
        storageBucket: "rock-paper-scissors-jfe.appspot.com",
        messagingSenderId: "1017728354075"
    };
    firebase.initializeApp(config);

    let database = firebase.database();
    let currentName = "";
    let currentWins = 0;
    let currentPlays = 0;
    let currentRocks = 0;
    let currentPapers = 0;
    let currentScissors = 0;
    let currentOpponent = "";
    let savedNames = [];
    let savedUsers = JSON.parse(localStorage.getItem('localUsers'));
    let userTuple = new Object();

    if (!Array.isArray(savedUsers)) {
        savedUsers = [];
    }

    function loadSavedUsers() {

        $('.saved-profiles').empty();

        let insideList = JSON.parse(localStorage.getItem('localUsers'));

        for (var i = 0; i < insideList.length; i++) {
            console.log(insideList[i].userName)
            savedNames.push(insideList[i].userName);
        }

        console.log(insideList);

        //here
        if (!Array.isArray(insideList)) {
            insideList = [];
        }

        for (var i = 0; i < savedNames.length; i++) {

            let item = $('<li>')
                .addClass('list-group-item')
                .text(savedNames[i])

            let close = $('<button>')
                .addClass('close text-right')
                .attr({
                    type: 'button',
                    'aria-label': 'Close'
                })
                .html('<span aria-hidden="true">&times;</span>')
                .attr("data-index", i);

            item.append(close);

            $('.saved-profiles').prepend(item);
        }
    }



    loadSavedUsers();

    $(document).on("click", "button.close", function () {
        let tupleList = JSON.parse(localStorage.getItem('localUsers'));
        var currentIndex = $(this).attr('data-index');

        // console.log($(this))
   
        database.ref("users/" + tupleList[currentIndex].userKey).remove(); //here

        //local delete
        tupleList.splice(currentIndex, 1);

        savedNames.splice(currentIndex, 1); //here
        
        savedUsers = tupleList;

        localStorage.setItem('localUsers', JSON.stringify(savedUsers));

        //firebase delete
  

        loadSavedUsers();
    });

    // var winCount = 0;
    // var lossCount = 0;
    // var tieCount = 0;

    // document.addEventListener("keyup", function (event) {

    //     var userGuess = event.key;
    //     var computerGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];
    //     if ((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {

    //         var user = document.querySelector(".p1");
    //         var cpu = document.querySelector(".p2");
    //         var win = document.querySelector(".win");
    //         var loss = document.querySelector(".loss");
    //         var tie = document.querySelector(".tie");

    //         user.innerHTML = userGuess;
    //         cpu.innerHTML = computerGuess;

    //         if ((userGuess === 'r' && computerGuess === 'p') || (userGuess === 'p' && computerGuess === 's') ||
    //             (userGuess === 's' && computerGuess === 'r')) {
    //             lossCount++
    //             loss.innerHTML = lossCount;
    //         } else if ((userGuess === 'p' && computerGuess === 'r') || (userGuess === 's' && computerGuess ===
    //                 'p') || (userGuess === 'r' && computerGuess === 's')) {
    //             winCount++
    //             win.innerHTML = winCount;
    //         } else {
    //             tieCount++
    //             tie.innerHTML = tieCount;
    //         }
    //     };
    // });

    function User(name, wins, plays, rocks, papers, scissors) {
        this.name = name;
        this.wins = wins;
        this.plays = plays;
        this.rocks = rocks;
        this.papers = papers;
        this.scissors = scissors;
    }


    if (localStorage.userkey) { //here delete

        database.ref("users/" + localStorage.userkey).on("value", function (snapshot) {
            let data = snapshot.val();

            // console.log(data)

            if (data && data.name) {
                // $(".add-form").hide();

                // let nameContainer = $(".name-wrapper");
                // nameContainer.show().find("h2").text("Welcome " + data.name + "!");

                // let editForm = $(".edit-form");

                // editForm.find("[name='username']").val(data.username);
                // editForm.find("[name='name']").val(data.name);
                // editForm.find("[name='email']").val(data.email);
                // editForm.find("[name='reason']").val(data.reason);

                // editForm.show();

                // $(".view-all-wrapper").show();

            }
        })
    }

    $('.submit-btn').click(function () {

        event.preventDefault();

        currentName = $('.username-input').val().trim();

        // console.log(savedUsers, currentName)

        if (!savedNames.includes(currentName)) { //loop out obj.userName to array then check

            let key = firebase.database().ref('users').push().key;

            // localStorage.setItem("userkey", key); //here delete

            userTuple.userName = currentName;

            userTuple.userKey = key;

            savedUsers.push(userTuple);

            localStorage.setItem('localUsers', JSON.stringify(savedUsers));

            // console.log(userTuple);

            firebase.database().ref('users/' + key).set({
                name: currentName,
                wins: currentWins,
                plays: currentPlays,
                rocks: currentRocks,
                papers: currentPapers,
                scissors: currentScissors,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
        }

        $('.screen-1').fadeOut("slow", function () {
            $('.screen-2').fadeIn("slow", function () {});
        });
    });

    $('.play-game').click(function () {
        $('.screen-2').fadeOut("slow", function () {
            $('.screen-3').fadeIn("slow", function () {});
        });
        currentOpponent = $(this).data('player')

        // console.log($(this).data('player'))

        loadSavedUsers();
    })

    function check(guess, opponent) {
        let userGuess = guess;
        let oppGuess = "";
        let computerChoices = ["r", "p", "s"];
        let computerGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];
        if (opponent) {}
    }


    $('.rock-btn').click(function () {
        $('.count-down').text('rock');

        let currentGuess = 'r';

        // console.log(currentGuess, currentOpponent)
        check(currentGuess, currentOpponent)
    });
    $('.paper-btn').click(function () {
        $('.count-down').text('paper');
    });
    $('.scissors-btn').click(function () {
        $('.count-down').text('scissors');
    });
})()

//add names in data not in local storage to opponent list if active; show waiting until both a playing, then count-down give 2 s to select, then auto select, then display results