async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
let disableBtn = (btn) => {
    btn.disabled = true;
    setTimeout(() => {
        btn.disabled = false;
    }, 10000)
}
const notify = document.querySelector(".notify");
let popup = (text) => {
    notify.innerHTML = text;
    notify.classList.add("enter");
    setTimeout(() => {
        notify.classList.remove("enter");
    }, 4000);
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


let renderEventDeets = (event, just) => {
    let eventDiv = document.createElement("div");
    eventDiv.classList.add("this-event");
    let pName = document.createElement("p");
    let pCode = document.createElement("p");
    let pPartMan = document.createElement("p");
    let eventbut = document.createElement("button");
    eventbut.classList.add("main-button")
    pName.innerHTML = `${event["Name"]}`;
    pCode.innerHTML = `${event["Code"]}`;
    pPartMan.innerHTML = `${event["Participants"]}`;
    eventbut.innerHTML = "Download Stats";
    eventDiv.appendChild(pName);
    eventDiv.appendChild(pCode);
    eventDiv.appendChild(pPartMan);
    eventDiv.appendChild(eventbut);
    if (just == "just") {
        historyGrid.insertBefore(eventDiv, historyGrid.childNodes[2]);
    }
    else {
        historyGrid.appendChild(eventDiv);
    }
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

    fetch("https://mighty-sea-62531.herokuapp.com/api/user/getEvents", requestOptions)
        .then(response => response.json())
        .then(result => {
            event_ids = result;
            getEventDetails();
        })
        .catch(error => console.log('error', error));
}



/* Handling History: End */





let goToLogin = () => {
    removeBorder();
    removeShow();
    mainContainer.classList.add("login-background")
    userLoginDiv.classList.add("show");
    if (window.innerWidth < 600) {
        navText.innerHTML = "Login";
    }
}





/* Handling the login */


const loginButton = document.querySelector("#login_button")
const login = document.querySelector("#user_login");
const userLoginDiv = document.querySelector(".user-login")
const notLoggedIn = document.querySelectorAll(".not-logged-in");
const content = document.querySelectorAll(".content");
let loggedIn = () => {
    if (!sessionStorage.getItem("auth_key")) {
        console.log("Not logged in")
        goToLogin();
        homeSelector.forEach(ele => {
            ele.style.color = "rgb(189, 189, 189)";
        })
        quizSelector.forEach(ele => {
            ele.style.color = "rgb(189, 189, 189)"
        })
        pollSelector.forEach(ele => {
            ele.style.color = "rgb(189, 189, 189)"
        })
        feedbackSelector.forEach(ele => {
            ele.style.color = "rgb(189, 189, 189)"
        })
        tabItems.forEach(ele => {
            ele.removeEventListener("click", selectItem);
        })
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
        if (!sessionStorage.getItem("quiz_action_id")) {
            quizSelector.forEach(ele => {
                ele.style.color = "rgb(189, 189, 189)";
                ele.removeEventListener("click", selectItem);
            })
        }
        if (!sessionStorage.getItem("poll_action_id")) {
            pollSelector.forEach(ele => {
                ele.style.color = "rgb(189, 189, 189)";
                ele.removeEventListener("click", selectItem);
            })
        }
        if (!sessionStorage.getItem("feedback_action_id")) {
            feedbackSelector.forEach(ele => {
                ele.style.color = "rgb(189, 189, 189)"
                ele.removeEventListener("click", selectItem);
            })
        }
        homeSelector.forEach(ele => {
            ele.style.color = "black";
            ele.addEventListener("click", selectItem);
        })
        login.innerHTML = "Logout";
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

    disableBtn(loginButton);

}

let logout = () => {
    if (login.innerHTML == "Logout") {
        sessionStorage.clear();
        location.reload();
    }
}




login.addEventListener("click", goToLogin);
login.addEventListener("click", logout);

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
const EventName = document.querySelector("#event_name");

createEventBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (sessionStorage.getItem("event_id")) {
        sessionStorage.removeItem("event_name")
        sessionStorage.removeItem("event_code")
        sessionStorage.removeItem("event_id")
        sessionStorage.removeItem("quiz_action_id");
        sessionStorage.removeItem("poll_action_id");
        sessionStorage.removeItem("feedback_action_id");
        performCheck();
        resetActionVariables();
    }
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
            sessionStorage.setItem("event_name", result["Name"]);
            AddActionDiv.classList.add("show");
            EventCodeDiv.innerHTML = `Event Code: ${result["Code"]}`;
            sessionStorage.setItem("event_code", result["Code"]);
            EventCodeDiv.classList.add("show");
            renderEventDeets(result, "just");
            popup("Event Generated");
        })
        .catch(error => console.log('Event Error', error));

    disableBtn(createEventBtn);
});


/* Adding Events: End */






/* Adding Actions */

function AddAction(e) {
    e.preventDefault();
    const action_data = {
        action_type: this.innerHTML,
        title: this.innerHTML
    }
    console.log(JSON.stringify(action_data))
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
                popup("Quiz Added")
                sessionStorage.setItem("quiz_action_id", result._id);
                console.log(sessionStorage.getItem("quiz_action_id"))

                quizSelector.forEach(ele => {
                    ele.style.color = "black";
                    ele.addEventListener("click", selectItem);
                })

                goTo(quizSelector);
            }
            if (this.innerHTML == "Poll") {
                popup("Poll Added")
                sessionStorage.setItem("poll_action_id", result._id)
                pollSelector.forEach(ele => {
                    ele.style.color = "black";
                    ele.addEventListener("click", selectItem);
                })
                goTo(pollSelector);
            }
            if (this.innerHTML == "Feedback") {
                popup("Feedback Added")
                sessionStorage.setItem("feedback_action_id", result._id)
                feedbackSelector.forEach(ele => {
                    ele.style.color = "black";
                    ele.addEventListener("click", selectItem);
                })
                goTo(feedbackSelector)
            }
        })
        .catch(error => console.log('Action Error', error));
    disableBtn(this);
}

const AddActionBtn = document.querySelectorAll(".action-btn")
AddActionBtn.forEach(ele => {
    ele.addEventListener("click", AddAction)
})


/* Adding Actions: End */



/* Adding Question and answers */





let pollQuestionsData = [];

function AddPollQuestion(e) {
    e.preventDefault();
    let questionOptions = document.querySelectorAll(".poll-option");
    let questionName = document.querySelector("#poll_name").value
    let Form = document.querySelector("#poll_form");
    let question = {};
    question.name = questionName;
    question.options = [];
    questionOptions.forEach(ele => {
        let opti = {
            option: ele.value
        }
        question.options.push(opti);
    })
    pollQuestionsData.push(question);
    console.log(questionsData)
    popup("Poll Question Added")
    Form.reset()
}




const AddQuestionBtn = document.querySelector("#add_question_btn");
const AddPollBtn = document.querySelector("#add_poll_btn");
let questionsData = [];
let question_no = 0;
function addQuestion(e) {
    e.preventDefault();
    let questionOptions = document.querySelectorAll(".quiz-option");
    let questionName = document.querySelector("#question_name").value
    let correctOption = document.querySelector("#correct_option").value;
    let Form = document.querySelector("#question_form");
    let question = {};
    question.name = questionName;
    question.correct = correctOption;
    question.options = [];
    questionOptions.forEach(ele => {
        let opti = {
            option: ele.value
        }
        question.options.push(opti);
    })
    questionsData.push(question);
    console.log(questionsData)
    popup("Quiz Question Added")
    Form.reset();
}


AddQuestionBtn.addEventListener("click", addQuestion);
AddPollBtn.addEventListener("click", AddPollQuestion);


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
let feedbackQuestions = [];
function addFeedbackQuestion(e) {
    e.preventDefault();
    let feedbackQuestion = document.querySelector("#feedback_name").value;
    const Form = document.querySelector(".feedback-create-container");
    let question = {};
    question.name = feedbackQuestion;
    feedbackQuestions.push(question);
    console.log(feedbackQuestions)
    Form.reset();
    popup("Feedback Question Added")

}

addFeedbackBtn.addEventListener("click", addFeedbackQuestion)













/* Handling the god damn fucking live quiz */


let quiz_opts = [];
let quiz = {};
let questions = [];
let socket;
let questionIds = [];
const quizDetailsDiv = document.querySelector(".quiz-details");
let currentQuestionId;
let questionNumber = 0;
const nextQuestionBtn = document.querySelector("#nxtq");
const nextPollBtn = document.querySelector("#next_poll")






let nextQuestionTrue = (type) => {
    var myHeaders = new Headers();
    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    let url;
    if (type == "quiz") {
        url = "https://mighty-sea-62531.herokuapp.com/api/questions/next/" + sessionStorage.getItem("quiz_action_id") + "/" + currentQuestionId;
    }
    if (type == "poll") {
        url = "https://mighty-sea-62531.herokuapp.com/api/questions/next/" + sessionStorage.getItem("poll_action_id") + "/" + currentQuestionId
    }
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            questionNumber++;
            currentQuestionId = result["_id"];
            if (type == "quiz") {
                socket.emit("next question", sessionStorage.getItem("quiz_action_id"));
            }
            if (type == "poll") {
                socket.emit("next question", sessionStorage.getItem("poll_action_id"));
            }
            renderQuizDetails();
        })
        .catch(error => console.log('error', error));
}

nextQuestionBtn.addEventListener("click", () => {
    nextQuestionTrue("quiz");
});

nextPollBtn.addEventListener("click", () => {
    nextQuestionTrue("poll");
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
        questionIds.push(ele["_id"])
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
let pollChart = document.querySelector('.poll-details').getContext('2d');
let MyChart = new Chart(ctx, temp);

let createChart = (chartDiv, ty) => {
    MyChart.destroy();
    MyChart = new Chart(chartDiv, {
        type: ty,
        data: {
            labels: [],
            datasets: [{
                label: "No. of ppl chose",
                data: [],
                backgroundColor: [
                    'rgba(254, 87, 81, 1)',
                    'rgba(82, 156, 251, 1)',
                    'rgba(50, 179, 115, 1)',
                    'rgba(254, 200, 52, 1)'
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

let resetActionVariables = () => {
    currentQuestionId = "";
    questionNumber = 0;
    quiz_opts = [];
    quiz = {};
    questions = [];
    questionIds = []
    questionsData = [];
    pollQuestionsData = [];
    socket = undefined;
}


let updateStats = (type,id) => {
    let url;
    if (type == "quiz") {
        url = "https://mighty-sea-62531.herokuapp.com/api/options/updateStat/" + id;
    }
    if (type == "poll") {
        url = "https://mighty-sea-62531.herokuapp.com/api/options/updateStat/" + id;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

    questionIds.forEach((questionId, index) => {
        quiz_opts[index].forEach(opt => {
            let raw = JSON.stringify({ "stat": `${opt["stat"]}`, "option": `${opt["option"]}` });

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(url + "/" + questionId + "/" + opt["_id"], requestOptions)
                .then(response => response.json())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        })
    })
}



let closeAction = (type) => {
    let closeUrl;
    if (type == "quiz") {
        closeUrl = "https://mighty-sea-62531.herokuapp.com/api/actions/closeAction/" + sessionStorage.getItem("quiz_action_id");
    }
    if (type == "poll") {
        closeUrl = "https://mighty-sea-62531.herokuapp.com/api/actions/closeAction/" + sessionStorage.getItem("poll_action_id");
    }
    if(type == "feedback"){
        closeUrl = "https://mighty-sea-62531.herokuapp.com/api/actions/closeAction/" + sessionStorage.getItem("feedback_action_id");
    }
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(closeUrl, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            if (type == "quiz") {
                socket.emit("close quiz", sessionStorage.getItem("quiz_action_id"));
                socket.disconnect();

                updateStats("quiz", sessionStorage.getItem("quiz_action_id"))
                popup("Quiz Closed")
                goTo(homeSelector);
                
                performCheck();
            }
            if (type == "poll") {
                socket.emit("close quiz", sessionStorage.getItem("poll_action_id"));
                socket.disconnect();
                updateStats("poll", sessionStorage.getItem("poll_action_id"));
                popup("Poll Closed")
                goTo(homeSelector);
                sessionStorage.removeItem("poll_action_id");
                performCheck();
            }
            if(type == "feedback"){
                popup("Feedback Closed")
                goTo(homeSelector);
                sessionStorage.removeItem("feedback_action_id");
                performCheck();
            }
            resetActionVariables();
        })
        .catch(error => console.log('error', error));


}

const closeQuizBtn = document.querySelector("#close_quiz");
closeQuizBtn.addEventListener("click", () => {
    closeAction("quiz");
});
const closePollBtn = document.querySelector('#close_poll');
closePollBtn.addEventListener("click", () => {
    closeAction("poll")
})
const closeFeedbackBtn = document.querySelector("#close_feedback");
closeFeedbackBtn.addEventListener("click", () => {
    closeAction("feedback")
})


/* Handling the rendering and functioning of a live Quiz Event: End */


/* Handling the rendering and functioning of a live Poll Event  */




let getPollDetails = () => {

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
                getQuizOptions();
            }
        })
        .catch(error => console.log('error', error));

}



/* Handling the rendering and functioning of a live Poll Event: End */





let feedbackResultQuestions = [];
let feedbackAnswers = [];
const feedbackQuestionDiv = document.querySelector(".feedback-question");
const feedbackAnswerDiv = document.querySelector(".feedback-answer");
const nextFeedbackBtn = document.querySelector("#next_feedback_btn");
const prevFeedbackBtn = document.querySelector("#prev_feedback_btn");
let feedbackNo = 0;
let renderFeedbackDeets = (question, answers) => {
    feedbackQuestionDiv.innerHTML = "";
    feedbackAnswerDiv.innerHTML = "";
    feedbackQuestionDiv.innerHTML = question;
    answers.forEach(answer => {
        let div = document.createElement("div");
        if(window.innerWidth > 600){
            div.style.maxWidth = (0.5*window.innerWidth) + "px";
        }
        else{

            div.style.maxWidth = (0.8*window.innerWidth) + "px";
        }
        div.innerHTML = answer["option"];
        div.classList.add("answer")
        feedbackAnswerDiv.appendChild(div)
    })

}


nextFeedbackBtn.addEventListener("click", () => {
    if (feedbackNo > (feedbackResultQuestions.length - 2)) {
        console.log("no more questions")
    }
    else {
        feedbackNo++;
        renderFeedbackDeets(feedbackResultQuestions[feedbackNo], feedbackAnswers[feedbackNo]);
    }
})
prevFeedbackBtn.addEventListener("click", () => {

    if (feedbackNo < 1) {
        console.log("can't go more back");
    }
    else {
        feedbackNo--;
        renderFeedbackDeets(feedbackResultQuestions[feedbackNo], feedbackAnswers[feedbackNo]);
    }
})







let getFeedbackAnswers = (data) => {
    data.Questions.forEach(question => {
        feedbackResultQuestions.push(question["name"]);
        feedbackAnswers.push(question["options"]);
    })
    console.log(feedbackResultQuestions, feedbackAnswers)
    renderFeedbackDeets(feedbackResultQuestions[0], feedbackAnswers[0]);
}




let getFeedbackDeets = () => {
    return new Promise((resolve, reject) => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
    
        fetch("https://mighty-sea-62531.herokuapp.com/api/actions/getActiondetail/" + sessionStorage.getItem("feedback_action_id"), requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                getFeedbackAnswers(result);
                resolve();
            })
            .catch(error => console.log('error', error));
    })
}



const refreshBtn = document.querySelector(".refresh-btn");
refreshBtn.addEventListener("click", async () => {
    feedbackResultQuestions = [];
    feedbackAnswers = [];
    await getFeedbackDeets();
    popup("Refreshed")
});








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
                createChart(ctx, sessionStorage.getItem("quizTheme"));
            }
            if (type == "poll") {
                console.log("Action is poll")
                getPollDetails();
                createChart(pollChart, sessionStorage.getItem("pollTheme"));
            }
            if (type == "feedback") {
                console.log("action type is feedback");
                getFeedbackDeets()
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

            var myHeaders = new Headers();
            myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));
            myHeaders.append("Content-Type", "application/json")
            var raw = JSON.stringify(questionsData);
            console.log(raw)

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://mighty-sea-62531.herokuapp.com/api/questions/addquestionsall/" + sessionStorage.getItem("quiz_action_id"), requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    popup("Quiz Published")
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                    };

                    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/openAction/" + actid, requestOptions)
                        .then(response => response.text())
                        .then(result => { console.log(result); firstQuestionPublish(actid, "quiz"); })
                        .catch(error => console.log('error', error));
                })
                .catch(error => console.log('error', error));
        }
        else {
            console.log("no quiz made");
        }
    }
    if (this.id == "publish_poll") {
        if (sessionStorage.getItem("poll_action_id")) {
            actid = sessionStorage.getItem("poll_action_id");

            var myHeaders = new Headers();
            myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));
            myHeaders.append("Content-Type", "application/json")
            var raw = JSON.stringify(pollQuestionsData);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://mighty-sea-62531.herokuapp.com/api/questions/addquestionsall/" + actid, requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    popup("Poll Published")
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                    };

                    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/openAction/" + actid, requestOptions)
                        .then(response => response.text())
                        .then(result => { console.log(result); firstQuestionPublish(actid, "poll"); })
                        .catch(error => console.log('error', error));
                })
                .catch(error => console.log('error', error));

        }
        else {
            console.log("no poll made");
        }
    }
    if (this.id == "publish_feedback") {
        if (sessionStorage.getItem("feedback_action_id")) {
            actid = sessionStorage.getItem("feedback_action_id");

            var myHeaders = new Headers();
            myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));
            myHeaders.append("Content-Type", "application/json")
            var raw = JSON.stringify(feedbackQuestions);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://mighty-sea-62531.herokuapp.com/api/questions/addquestionsall/" + actid, requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                    };

                    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/openAction/" + actid, requestOptions)
                        .then(response => response.text())
                        .then(result => { console.log(result); firstQuestionPublish(actid, "feedback") })
                        .catch(error => console.log('error', error));
                })
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



let performCheck = () => {
    if (!sessionStorage.getItem("quiz_action_id")) {
        quizSelector.forEach(ele => {
            ele.style.color = "rgb(189, 189, 189)";
            ele.removeEventListener("click", selectItem);
        })
    }
    if (!sessionStorage.getItem("poll_action_id")) {
        pollSelector.forEach(ele => {
            ele.style.color = "rgb(189, 189, 189)";
            ele.removeEventListener("click", selectItem);
        })
    }
    if (!sessionStorage.getItem("feedback_action_id")) {
        feedbackSelector.forEach(ele => {
            ele.style.color = "rgb(189, 189, 189)"
            ele.removeEventListener("click", selectItem);
        })
    }
    if (sessionStorage.getItem("event_id")) {
        EventName.value = sessionStorage.getItem("event_name")
        AddActionDiv.classList.add("show");
        EventCodeDiv.innerHTML = `Event Code: ${sessionStorage.getItem("event_code")}`;
        EventCodeDiv.classList.add("show")
    }
}
performCheck();


