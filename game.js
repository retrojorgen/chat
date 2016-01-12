var startTheApp = function () {

	var gameSettings = {
		lives: 3,
		highScore: 2000,
		width: window.innerWidth,
		height: window.innerHeight,
		levelHeight: window.innerHeight/2,
		levelScreen : $("#levelContainer").hide(),
		mainScreen: $("#mainscreen").hide(),
		authenticationScreen: $("#authenticationScreen").hide(),
		bottomContainer: $("#bottomContainer").hide(),
		usernameWelcome: $("#username-welcome"),
		startGameButton: $("#start-game-button"),
		usernameInput: $("#username-input"),
		emailInput: $("#email-input"),
		usernameForm: $("#username"),
		emailForm: $("#email"),
		mainScreenJanStandard: $("#mainscreen .janstandard"),
		logo: $("#logo"),
		livesUpdate: $("#lives")
	}

	if($("#mobile-wrapper").length) {
		gameSettings.width = 375;
		gameSettings.height = 667;

	}

	var currentGameData = {
		points: 0,
		level: 0,
		question: 0,
		answer: [],
		gameStatus: true,
		correctAnswersInCurrentLevel: 0,
		currentQuestionType: "single",
		currentQuestionContainerNode : undefined,
		lives: gameSettings.lives
	}

	var startMainScreen = function () {
		console.log("starting main");
		TweenMax.to(gameSettings.mainScreen, 0, {x: gameSettings.width, scale: 0.95, ease: Linear.easeNone});
		gameSettings.mainScreen.show();
		TweenMax.to(gameSettings.mainScreen, 1, {x: 0, scale: 1, ease: Bounce.easeOut});
	}

	var submitUsername = function () {
		var usernameTemp = gameSettings.usernameInput.val();
		console.log(usernameTemp);
		if(usernameTemp) {
			gameSettings.username = usernameTemp;
			TweenMax.to(gameSettings.usernameForm, 1,  {x: "-" + gameSettings.width, ease: Power4.easeOut, onComplete: function () {
				gameSettings.usernameForm.hide();	
			}});
			gameSettings.emailForm.show();
			TweenMax.to(gameSettings.emailForm, 1,  {x: 0, ease: Power4.easeOut, onComplete: function () {
				gameSettings.emailInput.focus();
			}});
		}
	}

	var submitEmail = function () {
		var emailTemp = gameSettings.emailInput.val();
		gameSettings.email = emailTemp;
		TweenMax.to(gameSettings.emailForm, 1,  {x: "-" + gameSettings.width, ease: Power4.easeOut, onComplete: function () {
			gameSettings.emailForm.hide();
			userAuthenticated();
		}});
	}

	var startAuth = function () {
		console.log("starting auth");
		TweenMax.to(gameSettings.authenticationScreen, 0, {x: gameSettings.width, ease: Linear.easeNone});
		TweenMax.to(gameSettings.usernameForm, 0, {x: 0, ease: Linear.easeNone});
		TweenMax.to(gameSettings.emailForm, 0, {x: gameSettings.width, ease: Linear.easeNone});
		gameSettings.authenticationScreen.show();
		gameSettings.usernameForm.show();
		TweenMax.to(gameSettings.authenticationScreen, 1, {x: 0, ease: Power4.easeOut, onComplete: function () {
			gameSettings.usernameInput.focus();
		}});
	}

	var translation = {
		"startLevel": "Start level",
		"newgame": "New game"
	}

	var userAuthenticated = function() {
		gameSettings.levelScreen.hide();

		gameSettings.usernameWelcome.text(gameSettings.username);
		TweenMax.to(gameSettings.mainScreen, 0, {x: 0, ease: Linear.easeNone});
		gameSettings.mainScreen.show();

		TweenMax.to(gameSettings.mainScreenJanStandard, 0, {y: 100, ease: Linear.easeNone});
		TweenMax.to(gameSettings.mainScreenJanStandard, 1, {y: 0, ease: Bounce.easeOut});

		TweenMax.to(gameSettings.logo, 0, {y: -100, scale: 0.5, ease: Linear.easeNone});
		TweenMax.to(gameSettings.logo, 1, {y: 0, scale: 1, ease: Bounce.easeOut});

		TweenMax.to(gameSettings.authenticationScreen, 1, {scale: 1.3, opacity: 0, ease: Power4.easeOut, onComplete: function () {
			gameSettings.authenticationScreen.hide();
		}});

	}

	gameSettings.usernameForm.submit(function (event) {
		event.preventDefault();
		event.stopPropagation();
		submitUsername();
	});

	gameSettings.emailForm.submit(function (event) {
		event.preventDefault();
		event.stopPropagation();
		submitEmail();
	});


	console.log(gameSettings.startGameButton);
	var startButtonTouch = new Hammer(gameSettings.startGameButton[0]);
	startButtonTouch.on('tap', function () {
		console.log("hei");
		startGame();
	});

	var startGame = function () {
		
		var checkAnswer = function () {
			console.log("sjekker svar");
			console.log(currentGameData.answer[0], Levels[currentGameData.level].questions[currentGameData.question].answer);
			if(Levels[currentGameData.level].questions[currentGameData.question].type == "single") {
				if(currentGameData.answer[0] == Levels[currentGameData.level].questions[currentGameData.question].answer) {
					return true;
				} else {
					return false;
				}
			} else {
				var trueArray = [];
				for (var x = 0; x<= Levels[currentGameData.level].questions[currentGameData.question].answer; x++) {
					if(Levels[currentGameData.level].questions[currentGameData.question].answer.indexOf(currentGameData.answer[x] > -1)) {
						trueArray.push(currentGameData.answer[x]);
					}
				}
				if(trueArray == currentGameData.answer) {
					return true;
				} else {
					return false;
				}
			}
		};
		
		// draw question and add to DOM
		var drawQuestion = function () {
			currentGameData.answer = [];
			var questionContainer = $("<div></div>").addClass("questionContainer");
			var questionTitle = $("<div></div>").addClass("question").text(Levels[currentGameData.level].questions[currentGameData.question].question);
			questionContainer.append(questionTitle);
			if(Levels[currentGameData.level].questions[currentGameData.question].type != "single") {
				questionContainer.addClass("multipleChoice").attr("data-q-id", currentGameData.question);
			} else {
				questionContainer.addClass("single").attr("data-q-id", currentGameData.question);
			}
			Levels[currentGameData.level].questions[currentGameData.question].alternatives.forEach(function (alternative, i) {
				var alternativeNode = $("<div></div>").addClass("alternative").text(alternative).attr("data-answer-id", i);
				var alternativeNodeTouch = new Hammer(alternativeNode[0]);
				alternativeNodeTouch.on("tap", function (event) {
					if(Levels[currentGameData.level].questions[currentGameData.question].type == "single") {
						currentGameData.answer = [$(event.target).attr("data-answer-id")];
						$(event.target).siblings(".alternative").removeClass("selected").addClass("faded");
						$(event.target).addClass("selected").removeClass("faded");
					} else {
						if($(event.target).hasClass("selected")) {
							var answerIndex = currentGameData.answer.indexOf($(event.target).attr("data-answer-id"));
							if(answerIndex > -1) {
								currentGameData.answer.slice(answerIndex, 1);
							}
						} else {
							currentGameData.answer.push($(event.target).attr("data-answer-id"));
						}
						$(event.target).toggleClass("selected");
					}
				});
				questionContainer.append(alternativeNode);
			});

			var selectButton = $("<div></div>").addClass("answerbutton").text("svar");
			var selectButtonTouch = new Hammer(selectButton[0]);
			selectButtonTouch.on('tap', function (event) {
				var that = window;

				console.log("that ", that);
				//event.preventDefault();
				//event.stopPropagation();
				if(checkAnswer()) {
					// right answer
					var qContainer = $(event.target).parent();
					if(Levels[currentGameData.level].questions[currentGameData.question].type == "single") {
						currentGameData.points += 10;
					} else {
						currentGameData.points += 20;	
					}
					$("#scoreinput").text(currentGameData.points);
					currentGameData.janStandard.addClass("rightjan");
					setTimeout(function () {
						currentGameData.janStandard.removeClass("rightjan");
					},500);
				} else {
					// wrong answer
					currentGameData.janStandard.addClass("wrongjan");

					// lose life
					currentGameData.lives--;
					gameSettings.livesUpdate.css("width", currentGameData.lives * 29);
					if(currentGameData.lives <= 0) {
						endGame();
					}

					setTimeout(function () {
						currentGameData.janStandard.removeClass("wrongjan");
					},500);
				}
				if(currentGameData.gameStatus) {
					currentGameData.question++;
					drawQuestion();
				}
				TweenMax.to($(event.target).parent(), 0.3, {x: "-" + gameSettings.width, ease:Power4.easeOut, onComplete: function () {
					console.log("hey");
					$(event.target).parent().remove();
				}});
			});
			questionContainer.append(selectButton);

			TweenMax.to(questionContainer, 0, {x: gameSettings.width, ease: Linear.easeNone});
			gameSettings.levelScreen.append(questionContainer);
			TweenMax.to(questionContainer, 0.3, {x: 0, ease: Power4.easeOut});
		};

		// loads level, sets timer.
		var loadLevel = function (level) {

			console.log(this);
			
			var titleField = $("<div</div>").attr("id", "titlefield").text(level.levelname);
			var countDownContainer = $("<div></div>").attr("id", "countdown").text(level.timeToBeatLevel);
			currentGameData.janStandard = $("<div></div>").addClass("janstandard small");
			currentGameData.rightJan = $("<div></div>").addClass("rightjan");
			currentGameData.wrongJan = $("<div></div>").addClass("wrongjan");
			var timerAnimated = $("<div></div>").attr("id", "timer");
			var levelCounter = level.timeToBeatLevel;
			TweenMax.to(timerAnimated, 0, {x: "-" + gameSettings.width, ease: Linear.easeNone});
			TweenMax.to(currentGameData.janStandard, 0, {y: 250, ease: Linear.easeNone});
			TweenMax.to(currentGameData.janStandard, 1, {y: 120, ease: Linear.easeNone});
			gameSettings.levelScreen.append(titleField, countDownContainer, timerAnimated, currentGameData.janStandard, currentGameData.rightJan, currentGameData.wrongJan);

			drawQuestion();

			var countDownInterval = setInterval (function () {
				levelCounter--;
				countDownContainer.text(levelCounter);
			}, 1000);

			setTimeout(function () {

			}, level.timeToBeatLevel * 1000);
			TweenMax.to(timerAnimated, level.timeToBeatLevel, {x: 0, ease: Linear.easeNone});

		}

		// show end screen with ok button
		// go back to main screen
		var endGame = function () {
			currentGameData.gameStatus = false;
		}

		// run on first init
		var init = function () {

			gameSettings.livesUpdate.css("width", currentGameData.lives * 29);
			
			currentGameData.level = 0;
			currentGameData.question = 0;


			gameSettings.levelScreen.show();
			gameSettings.bottomContainer.show();
			TweenMax.to(gameSettings.mainScreen, 1, {x: "-" + gameSettings.width, ease: Power4.easeInOut, onComplete: function () {

			}});

			TweenMax.to(gameSettings.bottomContainer, 0.5, {y: 0, ease: Bounce.easeInOut});

			loadLevel(Levels[0]);
			
		}

		init();
		console.log("hello")
	};

	if(!gameSettings.username) {
	  startAuth();
	} else {
	  startMainScreen();
	}

};



