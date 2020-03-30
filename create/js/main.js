/* Handling Movement between tabs */

const tabItems = document.querySelectorAll(".tab-item");
const tabContents = document.querySelectorAll(".tab-content")
const leftContent = document.querySelectorAll(".left-content");
let quizActive = false;
function selectItem(e) {
	// Remove all show and border classes
	removeBorder();
	removeShow();
	// Add border to current tab item
	this.classList.add('tab-border');
	// Grab content item from DOM
	const tabCont = document.querySelector(`.${this.id}`);
	const leftCont = document.querySelector(`.${this.id}-left`);
	// Add show class
	tabCont.classList.add('show');
	leftCont.classList.add('show');
	if (sessionStorage.getItem("quiz_action_id") == null || sessionStorage.getItem("quiz_action_id") == undefined) {
		quizActive = false;
	}
	else {
		quizActive = true;
	}
	if (quizActive && this.id == "quiz-control") {
		getQuizDetails();
	}
}
// Remove bottom borders from all tab items
let removeBorder = () => {
	tabItems.forEach(item => {
		item.classList.remove('tab-border');
	});
}

// Remove show class from all content items
let removeShow = () => {
	tabContents.forEach(item => {
		item.classList.remove('show');
	});
	leftContent.forEach(item => {
		item.classList.remove('show');
	});

}

// Listen for tab item click
tabItems.forEach(item => {
	item.addEventListener('click', selectItem);
});

/* Handling the Movement between tabs: End */



/* GoTo function */


const homeSelector = document.querySelector(".home-section");
const quizSelector = document.querySelector(".quiz-section");
const pollSelector = document.querySelector(".poll-section");
const feedbackSelector = document.querySelector(".feedback-section");

let goTo = (ele) => {
	removeBorder();
	removeShow();
	// Add border to current tab item
	ele.classList.add('tab-border');
	// Grab content item from DOM
	const tabCont = document.querySelector(`.${ele.id}`);
	const leftCont = document.querySelector(`.${ele.id}-left`);

	// Add show class
	tabCont.classList.add('show');
	leftCont.classList.add('show');
	console.log(sessionStorage.getItem("quiz_action_id"))
	if (sessionStorage.getItem("quiz_action_id") == null || sessionStorage.getItem("quiz_action_id") == undefined) {
		quizActive = false;
	}
	else {
		quizActive = true;
	}
	if (quizActive && ele.id == "quiz-control") {
		getQuizDetails();
	}
}


/* GoTo function: End */




/* Handling the login */



const loginButton = document.querySelector("#login_button")
const login = document.querySelector("#user_login");
const userLoginDiv = document.querySelector(".user-login-left");

let loggedIn = () => {
	if (!(sessionStorage.getItem("auth_key"))) {
		console.log("Not logged in")
	}
	else {
		console.log("Logged In");
		userLoginDiv.classList.remove("show");
		goTo(homeSelector);
	}
}
loggedIn();
let handleLogin = (e) => {
	e.preventDefault();
	const userEmail = document.querySelector("#user_email");
	const userPass = document.querySelector("#user_pass");
	const loginForm = document.querySelector("#login_form");
	var myHeaders_login = new Headers();
	myHeaders_login.append("Content-Type", "application/json");
	var raw_login = JSON.stringify({ "email": userEmail.value, "password": userPass.value });
	var requestOptions = {
		method: 'POST',
		headers: myHeaders_login,
		body: raw_login,
		redirect: 'follow'
	};

	fetch("https://mighty-sea-62531.herokuapp.com/api/user/login", requestOptions)
		.then(res => {
			loginForm.reset();
			return res.json()
		})
		.then(result => {
			console.log(result["Auth Token"])
			sessionStorage.setItem("auth_key", result["Auth Token"])
			console.log(sessionStorage.getItem("auth_key"))
			loggedIn();
		})
		.catch(error => console.log('error', error));

}

login.addEventListener("click", () => {
	removeBorder();
	removeShow();
	userLoginDiv.classList.add("show");
})
loginButton.addEventListener("click", handleLogin);



/* Handling the login: End */



/* Adding Events  */

const AddEventBtn = document.querySelector("#add_event_btn");
const AddActionDiv = document.querySelector(".add-actions")
AddEventBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const EventName = document.querySelector("#event_name");
	const data = {
		Name: EventName.value,
	}
	var raw = JSON.stringify(data);

	var requestOptions = {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"auth-token": "" + sessionStorage.getItem("auth_key")
		},
		body: raw,
		redirect: 'follow'
	};

	fetch("https://mighty-sea-62531.herokuapp.com/api/events/addEvent", requestOptions)
		.then(response => { return response.json() })
		.then(result => { console.log("Event Added", result); sessionStorage.setItem("event_id",result._id); AddActionDiv.style.display = "block" })
		.catch(error => console.log('Event Error', error));
})



/* Adding Events: End */



/* Handling Adding and Removing Options */


const AddOptionsBtn = document.querySelectorAll(".add-option-btn")
const DeleteOptionsBtn = document.querySelectorAll(".delete-option-btn");

function addOption(e) {
	e.preventDefault();
	const OptionsDiv = document.querySelector(`.${this.classList[1]}`)
	let inputField = document.createElement("input");
	inputField.placeholder = "Enter Option";
	if (this.classList[1] == "options-quiz") {
		inputField.classList.add("quiz-option");
	}
	if (this.classList[1] == "options-poll") {
		inputField.classList.add("poll-option");
	}
	OptionsDiv.appendChild(inputField)
}
function deleteOption(e) {
	e.preventDefault();
	const OptionsDiv = document.querySelector(`.${this.classList[1]}`);
	if (OptionsDiv.innerHTML === "") {
		return;
	}
	else {
		OptionsDiv.removeChild(OptionsDiv.lastChild)
	}
}

AddOptionsBtn.forEach(ele => {
	ele.addEventListener("click", addOption);
})
DeleteOptionsBtn.forEach(ele => {
	ele.addEventListener("click", deleteOption);
})


/* Handling Adding and Removing Options: End */



/* Adding Action */

function AddAction(e) {
	e.preventDefault();
	const action_data = {
		action_type: this.innerHTML,
	}
	var requestOptions = {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"auth-token": "" + sessionStorage.getItem("auth_key")
		},
		body: JSON.stringify(action_data),
		redirect: 'follow'
	};
	fetch("https://mighty-sea-62531.herokuapp.com/api/actions/addAction/" + sessionStorage.getItem("event_id"), requestOptions)
		.then(response => { return response.json(); })
		.then(result => {
			console.log("Action Added", result);
			if (this.innerHTML == "Quiz") {
				sessionStorage.setItem("quiz_action_id", result._id);
				console.log(sessionStorage.getItem("quiz_action_id"))
				goTo(quizSelector);
			}
			if (this.innerHTML == "Poll") {
				sessionStorage.setItem("poll_action_id", result._id)
				goTo(pollSelector);
			}
			if (this.innerHTML == "Feedback") {
				sessionStorage.setItem("feedback_action_id", result._id)
				goTo(feedbackSelector)
			}
		})
		.catch(error => console.log('Action Error', error));
}

const AddActionBtn = document.querySelectorAll(".add-event-btn")
AddActionBtn.forEach(ele => {
	ele.addEventListener("click", AddAction)
})

/* Adding Action: End */




/* Adding Question Details */


const AddQuestionBtn = document.querySelector("#add_question_btn")
const quizForm = document.querySelector("#question_form");
let question_no = 0;
function addQuestion(e) {
	e.preventDefault();
	let question = document.querySelector("#question_name")
	let questionOptions = document.querySelectorAll(".quiz-option");
	let correctOption = document.querySelector("#correct_option");
	let question_data = {
		name: question.value,
		correct: correctOption.value,
	}
	var requestOptions = {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"auth-token": "" + sessionStorage.getItem("auth_key")
		},
		body: JSON.stringify(question_data),
		redirect: 'follow'
	};
	fetch("https://mighty-sea-62531.herokuapp.com/api/questions/addQuestion/" + sessionStorage.getItem("quiz_action_id"), requestOptions)
		.then(response => { return response.json() })
		.then(result => {
			console.log("Question and Correct Option Added", result);
			sessionStorage.setItem("question_id", result._id);
			console.log(questionOptions)
			questionOptions.forEach(ele => {
				let option_data = {
					option: ele.value
				}
				var requestOptions = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json",
						"auth-token": "" + sessionStorage.getItem("auth_key")
					},
					body: JSON.stringify(option_data),
					redirect: 'follow'
				};
				fetch("https://mighty-sea-62531.herokuapp.com/api/options/addOption/" + sessionStorage.getItem("quiz_action_id") + "/" + sessionStorage.getItem("question_id"), requestOptions)
					.then(response => {
						return response.json();
					})
					.then(result => {
						console.log(result);
						quizForm.reset();
						document.querySelector("#publish_quiz").style.display = "block";
					})
					.catch(error => console.log('error', error));
			})
			question_no++;
		})
		.catch(error => console.log('Question and Correct Option Error', error));
}

AddQuestionBtn.addEventListener("click", addQuestion);


/* Adding Question Details: End */





/* Handling the rendering and functioning of a live Quiz Event */

let quiz_opts = [];
let quiz = {};
let questions = [];
let socket;
const quizControlLeftDiv = document.querySelector(".quiz-control-left");
let oldquizid = undefined;
let getQuizDetails = () => {
	if(/* question_no != 0 */ true){
		/* if (oldquizid == sessionStorage.getItem("quiz_action_id")) {
			socketConnection();
			continueSocketConnection();
		} */
		
			oldquizid = sessionStorage.getItem("quiz_action_id");
			var requestOptions = {
				method: 'GET',
				redirect: 'follow'
			};
			fetch("https://mighty-sea-62531.herokuapp.com/api/actions/getActiondetail/" + sessionStorage.getItem("quiz_action_id"), requestOptions)
				.then(response => {
					if (response.status == 200) {
						return response.json();
					}
					else {
						return "Error";
					}
				})
				.then(result => {
					if (result == "Error") {
						console.log("Error")
					}
					else {
						quiz = result;
						getQuizOptions();
					}
				})
				.catch(error => console.log('error', error));
		
	}
}
let getQuizOptions = () => {
	questions = quiz["Questions"];
	questions.forEach(ele => {
		quiz_opts.push(ele["options"])
	})
	console.log(quiz_opts)
	socketConnection();
}

let socketConnection = () => {
	socket = io('https://mighty-sea-62531.herokuapp.com/');
	socket.on("connect", () => {
		console.log(socket.connected)
		socket.on("New Connection", (updated_data) => {
			console.log(updated_data)
			if (updated_data.length != 0) {
				for (let i of updated_data) {
					quiz_opts.forEach(ele => {
						ele.forEach(elem => {
							if (i._id == elem._id) {
								elem.stat = i.stat;
							}
						})
					})
				}
			}
			renderQuizDetails();
			continueSocketConnection();
		})
	})
}
let continueSocketConnection = () => {
	socket.on('all options', (new_data) => {
		console.log(new_data)
		for (let k of quiz_opts) {
			k.forEach(ele => {
				if (new_data._id == ele._id) {
					ele.stat = new_data.stat;
				}
			})
		}
		renderQuizDetails();
	})
}
let renderQuizDetails = () => {
	quizControlLeftDiv.innerHTML = "";
	for (i = 0; i < questions.length; i++) {
		let h2 = document.createElement("h2");
		h2.innerHTML = questions[i]["name"];
		let optionDiv = document.createElement("div");
		quiz_opts[i].forEach(ele => {
			let p = document.createElement("p")
			p.innerHTML = `${ele["option"]} with stat: ${ele["stat"]}`;
			optionDiv.appendChild(p);
		})
		quizControlLeftDiv.append(h2);
		quizControlLeftDiv.appendChild(optionDiv)
	}
}



/* Handling the rendering and functioning of a live Quiz Event: End */








