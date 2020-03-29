/* Handling Movement between tabs */

const tabItems = document.querySelectorAll(".tab-item");
const tabContents = document.querySelectorAll(".tab-content")
const leftContent = document.querySelectorAll(".left-content");

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
		.then(result => { console.log("Event Added", result); sessionStorage.setItem("event_id", result._id); AddActionDiv.style.display = "block"})
		.catch(error => console.log('Event Error', error));
})














