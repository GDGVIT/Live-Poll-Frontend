


let oldquizid = "0";


/* Handling Movement between tabs */

const tabItems = document.querySelectorAll(".tab-item");
const tabContents = document.querySelectorAll(".tab-content");
const mainContainer = document.querySelector(".main-container");
const invertBtn = document.querySelectorAll(".invert-btn");
let quizActive = false;
function selectItem(e) {
    removeBorder();
    removeShow();
    mainContainer.classList.remove("login-background")
    this.classList.add('tab-border');
    const tabCont = document.querySelector(`.${this.id}`);
    tabCont.classList.add('show');
}


let removeBorder = () => {
    tabItems.forEach(item => {
        item.classList.remove('tab-border');
    });
}

let removeShow = () => {
    tabContents.forEach(item => {
        item.classList.remove('show');
    });
    invertBtn.forEach(ele => {
        ele.classList.remove("show")
    })
}

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
    ele.classList.add('tab-border');
    mainContainer.classList.remove("login-background")
    const tabCont = document.querySelector(`.${ele.id}`);
    tabCont.classList.add('show');
}


/* GoTo function: End */



/* Handling History */


let event_ids = [];
let event_deets = [];


let renderEventDeets = () => {
    console.log(event_deets)
}



let getEventDetails = () => {
    event_ids.forEach(event_id => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://mighty-sea-62531.herokuapp.com/api/events/getEventdetail/" + event_id, requestOptions)
            .then(response => response.json())
            .then(result => { event_deets.push(result); renderEventDeets(); })
            .catch(error => console.log('error', error));
    })
}



let handleHistory = () => {
    console.log("nice");
    var myHeaders = new Headers();
    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://mighty-sea-62531.herokuapp.com/api/user/getEvents", requestOptions)
        .then(response => response.json())
        .then(result => {
            event_ids = result;
            console.log(event_ids)
            getEventDetails();
        })
        .catch(error => console.log('error', error));
}



/* Handling History: End */











/* Handling the login */


const loginButton = document.querySelector("#login_button")
const login = document.querySelector("#user_login");
const userLoginDiv = document.querySelector(".user-login")
const notLoggedIn = document.querySelectorAll(".not-logged-in");
const content = document.querySelectorAll(".content");
let loggedIn = () => {
    if (!(sessionStorage.getItem("auth_key"))) {
        console.log("Not logged in")
    }
    else {
        console.log("Logged In");
        userLoginDiv.classList.remove("show");
        notLoggedIn.forEach(ele => {
            ele.classList.remove("show");
        })
        content.forEach(ele => {
            ele.classList.add("show");
        })
        goTo(homeSelector);
        handleHistory();
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
    mainContainer.classList.add("login-background")
    userLoginDiv.classList.add("show");

})
loginButton.addEventListener("click", handleLogin);



/* Handling the login: End */



/* Handling inverting between create and results page */



function handleInvert(e) {
    e.preventDefault();
    const thiscreate = document.querySelector(`.${this.classList[1]}-create`)
    const thisresult = document.querySelector(`.${this.classList[1]}-result`)
    thiscreate.classList.toggle("show-select");
    thisresult.classList.toggle("show-select");
}

invertBtn.forEach(ele => {
    ele.addEventListener("click", handleInvert);
})

/* Handling inverting between create and results page: End*/



/* Adding Events */

const createEventBtn = document.querySelector("#create_event_btn");
const AddActionDiv = document.querySelector(".add-action");
const EventCodeDiv = document.querySelector("#event_code");


createEventBtn.addEventListener("click", (e) => {
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
        .then(result => {
            console.log("Event Added", result);
            sessionStorage.setItem("event_id", result._id);
            AddActionDiv.classList.add("show");
            EventCodeDiv.innerHTML = `Event Code: ${result["Code"]}`;
            EventCodeDiv.classList.add("show");

        })
        .catch(error => console.log('Event Error', error));
});


/* Adding Events: End */


/* Adding Actions */

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

const AddActionBtn = document.querySelectorAll(".action-btn")
AddActionBtn.forEach(ele => {
    ele.addEventListener("click", AddAction)
})


/* Adding Actions: End */



/* Adding Question and answers */


const AddQuestionBtn = document.querySelector("#add_question_btn");
const AddPollBtn = document.querySelector("#add_poll_btn");
let question_no = 0;
function addQuestion(e) {
    e.preventDefault();
    let question;
    let question_data;
    let questionOptions = [];
    let correctOption;
    let Form;
    if (this.classList[1] == "quiz") {
        question = document.querySelector("#question_name")
        questionOptions = document.querySelectorAll(".quiz-option");
        correctOption = document.querySelector("#correct_option");
        actionId = sessionStorage.getItem("quiz_action_id");
        Form = document.querySelector("#question_form");
        question_data = {
            name: question.value,
            correct: correctOption.value,
        }
    }
    if (this.classList[1] == "poll") {
        question = document.querySelector("#poll_name")
        questionOptions = document.querySelectorAll(".poll-option");
        actionId = sessionStorage.getItem("poll_action_id");
        Form = document.querySelector("#poll_form")
        question_data = {
            name: question.value,
        }
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
    fetch("https://mighty-sea-62531.herokuapp.com/api/questions/addQuestion/" + actionId, requestOptions)
        .then(response => { return response.json() })
        .then(result => {
            console.log("Question and Correct Option Added", result);
            sessionStorage.setItem("question_id", result._id);
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
                        Form.reset();
                    })
                    .catch(error => console.log('error', error));
            })
            question_no++;
        })
        .catch(error => console.log('Question and Correct Option Error', error));
}

AddQuestionBtn.addEventListener("click", addQuestion);
AddPollBtn.addEventListener("click", addQuestion);


/* Adding Question and answers: End */










/* Handling Adding and Removing Options */

const AddOptionsBtn = document.querySelectorAll(".add-option-btn")
const DeleteOptionsBtn = document.querySelectorAll(".delete-option-btn");

function addOption(e) {
    e.preventDefault();
    console.log(this.classList)
    const OptionsDiv = document.querySelector(`#${this.classList[1]}_div`)
    let inputField = document.createElement("input");
    inputField.placeholder = "Enter Option";
    if (this.classList[1] == "quiz_options") {
        inputField.classList.add("quiz-option");
    }
    if (this.classList[1] == "poll_options") {
        inputField.classList.add("poll-option");
    }
    inputField.classList.add("main-input");
    OptionsDiv.appendChild(inputField)
}
function deleteOption(e) {
    e.preventDefault();
    const OptionsDiv = document.querySelector(`#${this.classList[1]}_div`);
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
















