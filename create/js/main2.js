async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
/* const start = async () => {
    await asyncForEach([1, 2, 3], async (num) => {
        console.log(num);
    });
    console.log('Done');
}
start(); */




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


const homeSelector = document.querySelectorAll(".home-section");
const quizSelector = document.querySelectorAll(".quiz-section");
const pollSelector = document.querySelectorAll(".poll-section");
const feedbackSelector = document.querySelectorAll(".feedback-section");
const navText = document.querySelector(".nav-text");

let goTo = (ele) => {
    removeBorder();
    removeShow();
    if (window.innerWidth < 600) {
        ele[0].classList.add('tab-border');
        mainContainer.classList.remove("login-background")
        navText.innerHTML = ele[0].innerHTML;
        const tabCont = document.querySelector(`.${ele[0].id}`);
        tabCont.classList.add('show');
    }
    else {
        ele[1].classList.add('tab-border');
        mainContainer.classList.remove("login-background")
        navText.innerHTML = ele[1].innerHTML;
        const tabCont = document.querySelector(`.${ele[1].id}`);
        tabCont.classList.add('show');
    }
}


/* GoTo function: End */



/* Handling History */


let event_ids = [];
let event_deets = [];
const historyGrid = document.querySelector(".history-grid");


let renderEventDeets = (event) => {
    let eventDiv = document.createElement("div");
    eventDiv.classList.add("this-event");
    let pName = document.createElement("p");
    let pTime = document.createElement("p");
    let pPartMan = document.createElement("p");
    let eventbut = document.createElement("button");
    eventbut.classList.add("main-button")
    pName.innerHTML = `${event["Name"]}`;
    pTime.innerHTML = "Not provided";
    pPartMan.innerHTML = `${event["Participants"]}`;
    eventbut.innerHTML = "Download Stats";
    eventDiv.appendChild(pName);
    eventDiv.appendChild(pTime);
    eventDiv.appendChild(pPartMan);
    eventDiv.appendChild(eventbut);
    historyGrid.appendChild(eventDiv);
}



let getEventDetails = () => {
    event_ids.forEach(event_id => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://mighty-sea-62531.herokuapp.com/api/events/getEventdetail/" + event_id, requestOptions)
            .then(response => response.json())
            .then(result => { renderEventDeets(result); })
            .catch(error => console.log('error', error));
    })
}



let handleHistory = () => {
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
            sessionStorage.setItem("auth_key", result["Auth Token"])
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
        question_data = JSON.stringify({
            "name": question.value,
            "correct": correctOption.value
        })
    }
    if (this.classList[1] == "poll") {
        question = document.querySelector("#poll_name")
        questionOptions = document.querySelectorAll(".poll-option");
        actionId = sessionStorage.getItem("poll_action_id");
        Form = document.querySelector("#poll_form")
        question_data = JSON.stringify({
            "name": question.value,
        })
    }
    var requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "auth-token": "" + sessionStorage.getItem("auth_key")
        },
        body: question_data,
        redirect: 'follow'
    };
    fetch("https://mighty-sea-62531.herokuapp.com/api/questions/addQuestion/" + actionId, requestOptions)
        .then(response => { return response.json() })
        .then(result => {
            console.log("Question and Correct Option Added", result);
            let question_id = result["_id"];
            questionOptions.forEach((ele) => {
                let option_data = {
                    "option": ele.value
                }
                let optionsData = JSON.stringify(option_data);
                var requestOptions = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": "" + sessionStorage.getItem("auth_key")
                    },
                    body: optionsData,
                    redirect: 'follow'
                };
                fetch("https://mighty-sea-62531.herokuapp.com/api/options/addOption/" + actionId + "/" + question_id, requestOptions)
                    .then(response => {
                        return response.json();
                    })
                    .then(result => {
                        console.log(result);
                        Form.reset();
                    })
                    .catch(error => console.log('error', error));
            })

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






/* SelectTheme */


sessionStorage.setItem("quizTheme", "pie");
sessionStorage.setItem("pollTheme", "bar");
sessionStorage.setItem("feedbackTheme", "cont");


const themeBtn = document.querySelectorAll(".theme-btn");
const icons = document.querySelectorAll(".icon");

let putwhite = () => {
    themeBtn.forEach(ele => {
        ele.classList.remove("blue-select");
    })
    icons.forEach(ele => {
        ele.classList.remove("white-select")
    })
}

function themeSelector(e) {
    e.preventDefault();
    putwhite();
    this.classList.add("blue-select");
    let icon = document.querySelector(`.${this.classList[4]}-white`);
    icon.classList.add("white-select")

    if (this.classList[2] === "quiz") {
        sessionStorage.setItem("quizTheme", this.classList[3]);
    }
    if (this.classList[2] === "poll") {
        sessionStorage.setItem("pollTheme", this.classList[3]);
    }
    if (this.classList[2] === "feedback") {
        sessionStorage.setItem("feedbackTheme", this.classList[3]);
    }
    console.log(sessionStorage.getItem("quizTheme"),
        sessionStorage.getItem("pollTheme"),
        sessionStorage.getItem("feedbackTheme"))
}
function changeWhite(e) {
    let icon = document.querySelector(`.${this.classList[4]}-white`);
    icon.classList.toggle("white")
}
themeBtn.forEach(ele => {
    ele.addEventListener("click", themeSelector);
})
themeBtn.forEach(ele => {
    ele.addEventListener("mouseover", changeWhite);
    ele.addEventListener("mouseout", changeWhite)
})


/* SelectTheme: End */



const addFeedbackBtn = document.querySelector("#add_feedback_btn");

function addFeedbackQuestion(e) {
    e.preventDefault();
    const feedbackQuestion = document.querySelector("#feedback_name")
    question_data = {
        name: feedbackQuestion.value,
    }
    console.log(question_data)
    var requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "auth-token": "" + sessionStorage.getItem("auth_key")
        },
        body: JSON.stringify(question_data),
        redirect: 'follow'
    };
    fetch("https://mighty-sea-62531.herokuapp.com/api/questions/addQuestion/" + sessionStorage.getItem("feedback_action_id"), requestOptions)
        .then(response => { return response.json() })
        .then(result => {
            console.log("Feedback Question Added", result);
        })
        .catch(error => console.log('Question Error', error));
}

addFeedbackBtn.addEventListener("click", addFeedbackQuestion)













/* Handling the god damn fucking live quiz */


let quiz_opts = [];
let quiz = {};
let questions = [];
let socket;
const quizDetailsDiv = document.querySelector(".quiz-details");
let currentQuestionId;
let questionNumber = 0;
const nextQuestionBtn = document.querySelector("#nxtq");



let nextQuestionSocket = () => {
    socket.emit("next question", sessionStorage.getItem("quiz_action_id"));
}






let nextQuestionTrue = () => {
    var myHeaders = new Headers();
    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://mighty-sea-62531.herokuapp.com/api/questions/next/" + sessionStorage.getItem("quiz_action_id") + "/" + currentQuestionId, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            questionNumber++;
            currentQuestionId = result["_id"];
            console.log(currentQuestionId);
            socket.emit("next question", sessionStorage.getItem("quiz_action_id"));
            renderQuizDetails();
        })
        .catch(error => console.log('error', error));
}

nextQuestionBtn.addEventListener("click", () => {
    nextQuestionTrue(currentQuestionId);
});



let getQuizDetails = () => {

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
let getQuizOptions = () => {
    questions = quiz["Questions"];
    console.log(questions)
    questions.forEach(ele => {
        quiz_opts.push(ele["options"])
    })
    console.log(quiz_opts)
    currentQuestionId = questions[0]["_id"];
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

let quiz_labels = [];
let quiz_data = [];
let temp = {};
let ctx = document.querySelector('.quiz-details').getContext('2d');
let MyChart = new Chart(ctx, temp);

let createChart = () => {
    MyChart.destroy();
    MyChart = new Chart(ctx, {
        type: sessionStorage.getItem("quizTheme"),
        data: {
            labels: [],
            datasets: [{
                label: "No. of ppl chose",
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: ""
            }
        }

    })
}


let renderQuizDetails = () => {
    MyChart.options.title.text = questions[questionNumber]["name"];
    quiz_opts[questionNumber].forEach((ele, index) => {
        quiz_labels.push(ele["option"])
        MyChart.data.labels[index] = ele["option"]
        quiz_data.push(ele["stat"]);
        MyChart.data.datasets[0].data[index] = ele["stat"];
    })
    MyChart.update();

}


let closeQuiz = () => {



    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/closeAction/5e57f66e89d8c00024e03296", requestOptions)
        .then(response => response.text())
        .then(result => { console.log(result); socket.emit("close quiz", sessionStorage.getItem("quiz_action_id")); })
        .catch(error => console.log('error', error));
    

}

const closeQuizBtn = document.querySelector("#close_quiz");
closeQuizBtn.addEventListener("click", closeQuiz);


/* Handling the rendering and functioning of a live Quiz Event: End */


/* Handling the rendering and functioning of a live Poll Event  */

/* let poll_opts = [];
let poll = {};
let poll_questions = [];
let socket;
const quizDetailsDiv = document.querySelector(".quiz-details");
let currentQuestionId;
let questionNumber = 0;
const nextQuestionBtn = document.querySelector("#nxtq");






let getQuizDetails = () => {

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/getActiondetail/" + sessionStorage.getItem("poll_action_id"), requestOptions)
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
                getPollOptions();
            }
        })
        .catch(error => console.log('error', error));

} */



/* Handling the rendering and functioning of a live Poll Event: End */










/* Handling turning isOpen on actions to true */



let firstQuestionPublish = (id, type) => {
    var myHeaders = new Headers();
    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://mighty-sea-62531.herokuapp.com/api/questions/publishQuestion/" + id, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            if (type == "quiz") {
                getQuizDetails();
                createChart();
            }
            if (type == "poll") {
                console.log("Action is poll")
                getPollDetails()
            }
            if (type == "feedback") {
                console.log("action type is feedback");
            }
        })
        .catch(error => console.log('error', error));
}





function publishAction(e) {
    e.preventDefault();
    let actid = "0";
    if (this.id == "publish_quiz") {
        if (sessionStorage.getItem("quiz_action_id")) {
            actid = sessionStorage.getItem("quiz_action_id");
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("https://mighty-sea-62531.herokuapp.com/api/actions/openAction/" + actid, requestOptions)
                .then(response => response.text())
                .then(result => { console.log(result); firstQuestionPublish(actid, "quiz"); })
                .catch(error => console.log('error', error));
        }
        else {
            console.log("no quiz made");
        }
    }
    if (this.id == "publish_poll") {
        if (sessionStorage.getItem("poll_action_id")) {
            actid = sessionStorage.getItem("poll_action_id");
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("https://mighty-sea-62531.herokuapp.com/api/actions/openAction/" + actid, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
        else {
            console.log("no poll made");
        }
    }
    if (this.id == "publish_feedback") {
        if (sessionStorage.getItem("feedback_action_id")) {
            actid = sessionStorage.getItem("feedback_action_id");
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("https://mighty-sea-62531.herokuapp.com/api/actions/openAction/" + actid, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
        else {
            console.log("no feedback made");
        }
    }
    if (actid == "0") {
        console.log("nice")
    }
}



const PublishBtn = document.querySelectorAll(".publish-btn");
PublishBtn.forEach(ele => {
    ele.addEventListener("click", publishAction);
})

/* Handling turning isOpen on actions to true: End */






/* handling the ham functionality */


const ham = document.querySelector(".ham");
const mobileNav = document.querySelector(".options-container-mobile");


let open = () => {
    mobileNav.classList.toggle("open");
}
let changeText = (ele) => {
    navText.innerHTML = ele.innerHTML;
}
ham.addEventListener("click", open);
const navButtons = document.querySelectorAll(".options-container-mobile p");
navButtons.forEach(ele => {
    ele.addEventListener("click", () => {
        open();
        changeText(ele);
    })
})















/* handling the ham functionality: End */







