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
    let currentGuess = "";
    let active = false;
    let currentOpponent = "";
    let opponentGuess = "";
    let savedNames = ['computer'];
    let savedUsers = JSON.parse(localStorage.getItem('localUsers'));
    let userTuple = new Object();
    let computerChoices = ["r", "p", "s"];
    let guessed = false;
    let oppKey = 'computer'
    let playGame = false;
    let oppWins = 0;
    let oppPlays = 0;
    let oppRocks = 0;
    let oppPapers = 0;
    let oppScissors = 0;

    if (!Array.isArray(savedUsers)) {
        savedUsers = [];
    }

    database.ref('users/computer').on('value', function (snap) {
        let data = snap.val()
        if (!data) {
            database.ref('users/computer').update({
                name: 'Computer',
                wins: oppWins,
                plays: oppPlays,
                rocks: oppRocks,
                papers: oppPapers,
                scissors: oppScissors,
                isActive: false,
                currentGuess: opponentGuess,
                opponent: ""
            })

        }
    })




    function loadSavedUsers() {

        $('.saved-profiles').empty();

        let insideList = JSON.parse(localStorage.getItem('localUsers'));

        if (insideList) {
            for (var i = 0; i < insideList.length; i++) {
              
                savedNames.push(insideList[i].userName);
            }
        }

        if (!Array.isArray(insideList)) {
            insideList = [];
        }

        for (var i = 0; i < savedNames.length - 1; i++) {

            let addBtn = $('<button>')
                .addClass('btn btn-light mb-2 existing-user-btn')
                .attr({
                    type: 'submit'
                })
                .text(insideList[i].userName)

            let item = $('<li>')
                .addClass('list-group-item')
                .append(addBtn);

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
        let currentIndex = $(this).attr('data-index');

        //firebase delete
        database.ref("users/" + tupleList[currentIndex].userKey).remove(); //here fix this

        //local delete
        tupleList.splice(currentIndex, 1);

        savedNames.splice(currentIndex, 1); //here

        savedUsers = tupleList;

        localStorage.setItem('localUsers', JSON.stringify(savedUsers));

        $(this).parent().remove();

        location.reload();
    });

    $(document).on("click", ".existing-user-btn", function () {

        addUser($(this).text())
    });

    $('.submit-btn').click(function (event) {

        let submitUser = $('.username-input').val().trim();

        addUser(submitUser);

    }); //submit-btn click

    function addUser(user) {

        playGame = true;

        event.preventDefault();

        currentName = user;

        if (currentName === "") {
            return;
        }

        if (savedNames.includes(currentName)) {
            userTuple.userName = currentName;

            let currentKey = "";
            let tupleList = JSON.parse(localStorage.getItem('localUsers'));

            for (var i = 0; i < tupleList.length; i++) {
                if ((tupleList[i].userName === currentName)) {
                    currentKey = tupleList[i].userKey;
                }

            }
            userTuple.userKey = currentKey;

        } else {
            let key = firebase.database().ref('users').push().key;

            userTuple.userName = currentName;

            userTuple.userKey = key;

            savedUsers.push(userTuple);

            savedNames.push(currentName);

            localStorage.setItem('localUsers', JSON.stringify(savedUsers));

            database.ref('users/' + key).set({
                name: currentName,
                wins: currentWins,
                plays: currentPlays,
                rocks: currentRocks,
                papers: currentPapers,
                scissors: currentScissors,
                isActive: active,
                currentGuess: currentGuess,
                opponent: ""
            });


        }

        database.ref('users/' + userTuple.userKey).update({
            isActive: true
        });

        $('.screen-1').fadeOut("slow", function () {

            loadOpponents()

            $('.screen-2').fadeIn("slow", function () {});
        });

        if (userTuple.userKey) {
            database.ref('users/' + userTuple.userKey).onDisconnect().update({
                currentGuess: "",
                opponent: "",
                isActive: false
            })
        }



    } //addUser



    function countDown() { //remove?
        $('.count-down')

        //after count down
        let timeOut = computerChoices[Math.floor(Math.random() * computerChoices.length)];

        // check(timeOut, )
    }

    function loadOpponents() {
        let name = "";
        for (var i = 0; i < savedNames.length; i++) {
            name = savedNames[i];
            if (name === 'computer') {} else {
                let newOpp = $('<div>')
                    .addClass('card player-card')
                    .html('<div class="card-header" id="heading' + i + '"><h5 class="mb-0"><button class="btn btn-outline-info btn-block collapsed" data-toggle="collapse" data-target="#collapse' + i + '" aria-expanded="true" aria-controls="collapse' + i + '">' + name + '</button></h5></div><div id="collapse' + i + '" class="collapse" aria-labelledby="heading' + i + '" data-parent="#accordion"><div class="card-body"><div class="card stat-card"><div class="card-body"><h5 class="card-title"><span class="opponent">' + name + '</span> Stats:</h5><hr><div class="row card-content"><div class="card-text col-6"> Win Rate:<br><strong>Past Selections</strong><br><div class="container">Rock:<br> Paper:<br> Scissors:</div></div><div class="card-text col-6"><span class="' + name + '-win-count">0</span>%<br><br><span class="' + name + '-rock-throws">0</span>%<br><span class="' + name + '-paper-throws">0</span>%<br><span class="' + name + '-scissor-throws">0</span>%</div></div></div></div><button type="button" class="btn btn-success btn-block play-game" data-player=' + name + '>Play<span class="opponent">Opponent</span></button></div></div></div>')
                //here replace two with three and so on
                $('#accordion').append(newOpp);
                updateData()
            }
        }
    };

    $(document).on("click", ".play-game", function () {

        $('.screen-2').fadeOut("slow", function () {
            $('.screen-3').fadeIn("slow", function () {});
        });
        currentOpponent = $(this).data('player')

        for (var i = 0; i < savedUsers.length; i++) {
            if (savedUsers[i].userName === currentOpponent) {
                oppKey = savedUsers[i].userKey;
            }
        }

        database.ref('users/' + oppKey).update({
            opponent: userTuple.userName,
            isActive: false,
        });

        database.ref('users/' + userTuple.userKey).update({
            opponent: currentOpponent,
            isActive: false,
        });

        database.ref('users/' + oppKey).onDisconnect().update({
            currentGuess: "",
            opponent: "",
            isActive: false
        })

        database.ref("users/" + userTuple.userKey).on("value", function (snapshot) { //call function pass in letter of guess
            let data = snapshot.val();

            currentWins = data.wins;
            currentPlays = data.plays;
            currentRocks = data.rocks;
            currentPapers = data.papers;
            currentScissors = data.scissors;
        });

        database.ref("users/" + oppKey).on("value", function (snapshot) { //call function pass in letter of guess
            let data = snapshot.val();

            oppWins = data.wins;
            oppPlays = data.plays;
            oppRocks = data.rocks;
            oppPapers = data.papers;
            oppScissors = data.scissors;
        });
    })

    function check(guess, opponent) {
        let userGuess = guess;
        let oppGuess = opponent;

        if ((userGuess === 'r' && oppGuess === 'p') || (userGuess === 'p' && oppGuess === 's') ||
            (userGuess === 's' && oppGuess === 'r')) {
            $('.count-down').text(currentOpponent + ' wins!')
            oppWins++
            database.ref('users/' + oppKey).update({
                wins: oppWins,
                currentGuess: "",
                plays: oppPlays,
                rocks: oppRocks,
                papers: oppPapers,
                scissors: oppScissors,
            })
            database.ref('users/' + userTuple.userKey).update({
                wins: currentWins,
                currentGuess: "",
                plays: currentPlays,
                rocks: currentRocks,
                papers: currentPapers,
                scissors: currentScissors,
            })
            updateData()
        } else if ((userGuess === 'p' && oppGuess === 'r') || (userGuess === 's' && oppGuess ===
                'p') || (userGuess === 'r' && oppGuess === 's')) {
            $('.count-down').text(currentName + ' wins!')
            currentWins++
            database.ref('users/' + userTuple.userKey).update({
                wins: currentWins,
                currentGuess: "",
                plays: currentPlays,
                rocks: currentRocks,
                papers: currentPapers,
                scissors: currentScissors,
            })
            database.ref('users/' + oppKey).update({
                wins: oppWins,
                currentGuess: "",
                plays: oppPlays,
                rocks: oppRocks,
                papers: oppPapers,
                scissors: oppScissors,
            })
            updateData()
        } else {
            $('.count-down').text("It's a tie!")
            database.ref('users/' + userTuple.userKey).update({
                wins: currentWins,
                currentGuess: "",
                plays: currentPlays,
                rocks: currentRocks,
                papers: currentPapers,
                scissors: currentScissors,
            })
            database.ref('users/' + oppKey).update({
                wins: oppWins,
                currentGuess: "",
                plays: oppPlays,
                rocks: oppRocks,
                papers: oppPapers,
                scissors: oppScissors,
            })
            updateData()
        }

        $('.choice').fadeOut("slow", function () {
            $('.replay-options').fadeIn("slow", function () {

            })
        })

        $('.title-main').fadeOut("slow", function () {
            $('.guess-result').fadeIn("slow", function () {});
        });




    }

    function updateData() {


        let tupleList = JSON.parse(localStorage.getItem('localUsers'));

        database.ref('users/computer').on('value', function (snap) {
            let data = snap.val();

            $('.computer-win-count').text(Math.round((data.wins / data.plays) * 100))
            $('.computer-rock-throws').text(Math.round((data.rocks / data.plays) * 100))
            $('.computer-paper-throws').text(Math.round((data.papers / data.plays) * 100))
            $('.computer-scissor-throws').text(Math.round((data.scissors / data.plays) * 100))
        })

        for (var i = 0; i < tupleList.length; i++) {

            database.ref('users/' + tupleList[i].userKey).on('value', function (snap) {
                let data = snap.val();

                $('.' + data.name + '-win-count').text(Math.round((data.wins / data.plays) * 100))
                $('.' + data.name + '-rock-throws').text(Math.round((data.rocks / data.plays) * 100))
                $('.' + data.name + '-paper-throws').text(Math.round((data.papers / data.plays) * 100))
                $('.' + data.name + '-scissor-throws').text(Math.round((data.scissors / data.plays) * 100))

            })
        }
    }



    function recordGuess(letterOfGuess) {

        if (!guessed) {

            let playerResultIcon = $('<i>');

            let oppResultIcon = $('<i>');

            currentPlays++

            switch (currentGuess) {
                case 'r':
                    currentRocks++;
                    playerResultIcon.addClass('far fa-hand-rock display-result');
                    $('.header-rock h1').text('Rock');
                    break;
                case 'p':
                    currentPapers++;
                    playerResultIcon.addClass('far fa-hand-paper display-result');
                    $('.header-rock h1').text('Paper');
                    break;
                case 's':
                    currentScissors++;
                    playerResultIcon.addClass('far fa-hand-peace display-result');
                    $('.header-rock h1').text('Scissors');
                    break;
            }

            //prop obj currentRoom update prop on ref , set current room to opp key

            //run on second guess

            //firebase .off to shake handler (room) 

            oppPlays++

            switch (opponentGuess) {
                case 'r':
                    oppRocks++;
                    oppResultIcon.addClass('far fa-hand-rock display-result');
                    $('.header-scissors h1').text('Rock');
                    break;
                case 'p':
                    oppPapers++;
                    oppResultIcon.addClass('far fa-hand-paper display-result');
                    $('.header-scissors h1').text('Paper');
                    break;
                case 's':
                    oppScissors++;
                    oppResultIcon.addClass('far fa-hand-peace display-result');
                    $('.header-scissors h1').text('Scissors');
                    break;
            }

            $('.header-rock span').text(currentName + "'s selection");
            $('.icon-left').append(playerResultIcon);
            $('.header-scissors span').text(currentOpponent + "'s selection");
            $('.icon-right').append(oppResultIcon);

            check(currentGuess, opponentGuess)

            guessed = true;
        }
    }

    function resetGame() { //add to new opp
        guessed = false;



        $('.header-scissors h1').text('Scissors');
        $('.header-scissors span').text('(beats paper)')
        $('.header-rock h1').text('Rock');
        $('.header-rock span').text('(beats scissors)');

        $('.guess-result').fadeOut("slow", function () {
            $('.title-main').fadeIn("slow", function () {

            });
            $('.display-result').remove();

        });

        $('.replay-options').fadeOut("slow", function () {
            $('.choice').fadeIn("slow", function () {

            })
        })

        $('.count-down').text('Ready!')
    }



    $('.play-again').click(function () {
        resetGame();
    })

    function forClick(letter) {
        if (currentOpponent === 'computer') {
            opponentGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];
        } else {
            opponentGuess = database.ref('user/' + oppKey + '/currentGuess');
        }

        currentGuess = letter;

        database.ref('users/' + userTuple.userKey).update({
            currentGuess: currentGuess
        })

        if (currentGuess !== "" && opponentGuess !== "") {

            recordGuess(currentGuess, opponentGuess);

        } else if (currentGuess === "" && opponentGuess !== "") {

            $('.count-down').text(currentOpponent + ' has guessed! Waiting on ' + currentName + '!')

        } else if (currentGuess !== "" && opponentGuess === "") {

            $('.count-down').text(currentName + ' has guessed! Waiting on ' + currentOpponent + '!')

        } else {}
    }

    $('.rock-btn').click(function () {
        $('.count-down').text('rock'); //here delete

        forClick('r')

    });
    $('.paper-btn').click(function () {
        $('.count-down').text('paper'); //here delete

        forClick('p')

    });
    $('.scissors-btn').click(function () {
        $('.count-down').text('scissors'); //here delete

        forClick('s')
    });

    updateData();

})()

//add names in data not in local storage to opponent list if active; show waiting until both a playing, then count-down give 2 s to select, then auto select, then display results