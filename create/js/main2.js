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
let popup = (text, error) => {
    if (error) {
        notify.classList.add("button-hover");
        notify.innerHTML = `<i class = "material-icons">close</i>  <p>  ${text}</p>`;
    }
    else {
        notify.classList.remove("button-hover")
        notify.innerHTML = `<i class = "material-icons">check</i>  <p>  ${text}</p>`;
    }
    notify.classList.add("enter");
    setTimeout(() => {
        notify.classList.remove("enter");
    }, 4000);
}
let addLoader = (button) => {

    button.style.width = button.offsetWidth + "px";
    /* button.style.height = button.offsetHeight + "px"; */
    button.style.overflow = "hidden";
    button.innerHTML = '<img src="../img/loading.gif" alt="" class = "loading-gif">'
}
let removeLoader = (button, text) => {
    button.innerHTML = text;
    button.removeAttribute("style");
}
let checkEventExistance = (event_id) => {
    /* console.log("Sent Event id = ", event_id, "session Event Id", sessionStorage.getItem("event_id")); */
    if (!sessionStorage.getItem("event_id")) {
        return false;
    }
    if (event_id == sessionStorage.getItem("event_id")) {
        return false;
    }
    else {
        return true;
    }
}
let resetActionIds = (type) => {
    if (type) {
        sessionStorage.removeItem(`${type}_action_id`);
    }
    else {
        console.log("here")
        sessionStorage.removeItem("quiz_action_id");
        sessionStorage.removeItem("poll_action_id");
        sessionStorage.removeItem("feedback_action_id");
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

/* Activate Tabs */

function ActivateAction(ty) {
    let type = ty.toLowerCase();
    if (type == "quiz") {
        quizSelector.forEach(ele => { ele.style.color = "black"; ele.addEventListener("click", selectItem); })
    }
    if (type == "poll") {
        pollSelector.forEach(ele => { ele.style.color = "black"; ele.addEventListener("click", selectItem); })
    }
    if (type == "feedback") {
        feedbackSelector.forEach(ele => { ele.style.color = "black"; ele.addEventListener("click", selectItem); })
    }
}




/* Activate Tabs: End */


/* Handling History */


let event_ids = [];
let event_deets = [];
const historyGrid = document.querySelector(".history-grid");
const iconsDiv = document.querySelector(".icons")



const prevEventsDeetsDiv = document.querySelector(".prev-event-deets");


let renderQuiz = {};
let renderQuestions = [];
let renderOptions = [];
let renderCorrect = [];
let renderQuestionNumber = 0;
let temp1 = {};
let actionGraph = document.querySelector('.action-graph').getContext('2d');
let actionGraphDiv = document.querySelector(".action-graph");
let displayChart = new Chart(actionGraph, temp1);
let event_type;
displayChart.canvas.parentNode.style.width = (0.87 * window.innerWidth) + "px";
displayChart.canvas.parentNode.style.height = (0.60 * window.innerHeight) + "px";
const feedbackDiv = document.querySelector(".feedback-history")
let renderChart = () => {
    displayChart.destroy();
    displayChart = new Chart(actionGraph, {
        type: 'bar',
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
            },
            maintainAspectRatio: false
        }

    })

}


let updateChartData = () => {
    displayChart.options.title.text = renderQuestions[renderQuestionNumber];
    renderOptions[renderQuestionNumber].forEach((ele, index) => {
        displayChart.data.labels[index] = ele["option"]
        displayChart.data.datasets[0].data[index] = ele["stat"];
    })

    displayChart.update();
}



const renderNext = document.querySelector("#next_ques");
const renderPrev = document.querySelector('#prev_ques');

renderNext.addEventListener("click", () => {

    if (renderQuestionNumber > (renderQuestions.length - 2)) {
        console.log("cant go more")
        /* popup("End of Action Questions") */

    }
    else {
        renderPrev.classList.remove("disable-btn")
        renderQuestionNumber++;
        if (renderQuestionNumber == (renderQuestions.length - 1)) {
            renderNext.classList.add("disable-btn")
        }
        if (event_type == "Feedback") {
            renderFeedback();
        }
        else {
            updateChartData();
        }
    }
})
if (renderQuestionNumber == 0) {
    renderPrev.classList.add("disable-btn")
}
renderPrev.addEventListener("click", () => {

    if (renderQuestionNumber < 1) {
        console.log("cant go more back")
        /* popup("This is the first question") */

    }
    else {
        renderNext.classList.remove("disable-btn")
        renderQuestionNumber--;
        if (renderQuestionNumber == 0) {
            renderPrev.classList.add("disable-btn");
        }
        if (event_type == "Feedback") {
            renderFeedback();
        }
        else {
            updateChartData();
        }
    }
})


let renderFeedback = () => {
    feedbackDiv.innerHTML = "";
    let masterDiv = document.createElement("div");
    masterDiv.classList.add("feedback-details");
    let AnswerDiv = document.createElement("div");
    AnswerDiv.classList.add("feedback-answer");
    let question_name = document.createElement("h1");
    question_name.classList.add("feedback-question");
    question_name.innerHTML = renderQuestions[renderQuestionNumber];
    renderOptions[renderQuestionNumber].forEach(answer => {
        let div = document.createElement("div");
        if (window.innerWidth > 600) {
            div.style.maxWidth = (0.5 * window.innerWidth) + "px";
        }
        else {

            div.style.maxWidth = (0.8 * window.innerWidth) + "px";
        }
        div.innerHTML = answer["option"];
        div.classList.add("answer")
        AnswerDiv.appendChild(div)
    })
    masterDiv.appendChild(question_name);
    masterDiv.appendChild(AnswerDiv);
    feedbackDiv.appendChild(masterDiv);
}






let handleEventDeets = (event_id, action_id) => {
    prevEventsDeetsDiv.classList.add("show-action")
    historyGrid.classList.remove("show-action");
    iconsDiv.classList.remove("show-action")
    console.log(event_id, action_id)
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/getActiondetail/" + action_id, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            event_type = result["action_type"];
            if (result["Questions"].length == 0) {
                document.querySelector(".action-buttons").style.display = "none";
                document.querySelector(".feedback-history").innerHTML = '<h1>There are no questions in this action</h1>'
            }
            else {
                document.querySelector(".action-buttons").removeAttribute("style");
                document.querySelector(".feedback-history").innerHTML = "";
                result["Questions"].forEach((ele) => {
                    renderQuestions.push(ele["name"])
                    renderOptions.push(ele["options"]);
                    renderCorrect.push(ele["correct"]);
                })
                if (renderQuestions.length == 1) {
                    renderNext.classList.add("disable-btn")
                }
                if (result["action_type"] == "Feedback") {
                    actionGraphDiv.classList.remove("show")
                    displayChart.destroy();
                    feedbackDiv.classList.add("show")
                    renderFeedback();

                }
                else {
                    feedbackDiv.classList.remove("show")
                    actionGraphDiv.classList.add("show")
                    renderChart();
                    updateChartData();
                }
            }
        })
        .catch(error => console.log('error', error));
}















document.querySelector(".cancel-event-deets").addEventListener("click", () => {
    prevEventsDeetsDiv.classList.remove("show-action");
    actionGraphDiv.classList.remove("show")
    feedbackDiv.classList.remove("show")
    historyGrid.classList.add("show-action");
    iconsDiv.classList.add("show-action");
    renderQuiz = {};
    renderQuestions = [];
    renderOptions = [];
    renderCorrect = [];
    renderQuestionNumber = 0;
    event_type = undefined;
    displayChart.destroy();
    renderPrev.classList.remove("disable-btn");
    renderNext.classList.remove("disable-btn")

    renderPrev.classList.add("disable-btn");

    /* displayChart = new Chart(actionGraph, temp1); */
})






let renderEventHistory = (event, actions, just) => {
    let quizno = 0;
    let pollno = 0;
    let feedbackno = 0;
    let EventDiv = document.createElement("li");
    let EventHeader = document.createElement("div");
    EventDiv.classList.add("event-div");
    EventHeader.classList.add("collapsible-header")
    EventHeader.classList.add("event");
    if (window.innerWidth > 600) {
        EventHeader.innerHTML = `<p>${event["Name"]}</p>
        <p>${event["Code"]}</p>
        <p>${event["Participants"]}</p>
        <p><i class="material-icons drop">arrow_drop_down</i></p>`;
    }
    else {
        EventHeader.innerHTML = `<p>${event["Name"]}</p>
        <p>${event["Code"]}</p>
        <p>${event["Participants"]}</p>`;
    }
    EventDiv.appendChild(EventHeader)

    let EventBody = document.createElement("div");
    EventBody.classList.add("collapsible-body")
    EventBody.classList.add("action-deets");
    let ActionsDiv = document.createElement("ul");
    ActionsDiv.classList.add("collapsible");
    ActionsDiv.classList.add("expandable")
    let li1 = document.createElement("li");
    let li2 = document.createElement("li");
    let li3 = document.createElement("li");
    let li1Header = document.createElement("div");
    let li2Header = document.createElement("div");
    let li3Header = document.createElement("div");
    li1Header.classList.add("collapsible-header")
    li1Header.classList.add("action-type")
    li2Header.classList.add("collapsible-header")
    li2Header.classList.add("action-type")
    li3Header.classList.add("collapsible-header")
    li3Header.classList.add("action-type")

    li1Header.innerHTML = '<strong>Quizzes</strong><i class = "material-icons">arrow_drop_down</i>'
    li2Header.innerHTML = '<strong>Polls</strong><i class = "material-icons">arrow_drop_down</i>';
    li3Header.innerHTML = '<strong>Feedbacks</strong><i class = "material-icons">arrow_drop_down</i>';
    li1.appendChild(li1Header)
    li2.appendChild(li2Header)
    li3.appendChild(li3Header)
    let quizzesDiv = document.createElement("div");
    let pollsDiv = document.createElement("div");
    let feedbacksDiv = document.createElement("div");
    quizzesDiv.classList.add("collapsible-body")
    quizzesDiv.classList.add("actions")
    pollsDiv.classList.add("collapsible-body")
    pollsDiv.classList.add("actions")
    feedbacksDiv.classList.add("collapsible-body")
    feedbacksDiv.classList.add("actions")

    actions.forEach((ele, i) => {
        let p = document.createElement("p");
        p.id = `${ele["_id"]}`
        p.value = `${event["_id"]}`
        p.addEventListener("click", () => {
            handleEventDeets(p.value, p.id);
        })
        if (ele["action_type"] == "Quiz") {
            quizno++;
            p.innerHTML = `${ele["title"]}`
            quizzesDiv.appendChild(p)
        }
        if (ele["action_type"] == "Poll") {
            pollno++;
            p.innerHTML = `${ele["title"]}`
            pollsDiv.appendChild(p)
        }
        if (ele["action_type"] == "Feedback") {
            feedbackno++;
            p.innerHTML = `${ele["title"]}`
            feedbacksDiv.appendChild(p)
        }
    })
    if (quizno == 0) {
        let pEmpty = document.createElement("p");
        pEmpty.innerHTML = "There are no quizzes in this Event";
        pEmpty.style.color = "red";
        quizzesDiv.appendChild(pEmpty)
    }
    if (pollno == 0) {
        let pEmpty = document.createElement("p");
        pEmpty.innerHTML = "There are no polls in this Event";
        pEmpty.style.color = "red";
        pollsDiv.appendChild(pEmpty)
    }
    if (feedbackno == 0) {
        let pEmpty = document.createElement("p");
        pEmpty.innerHTML = "There are no feedbacks in this Event";
        pEmpty.style.color = "red";
        feedbacksDiv.appendChild(pEmpty)
    }

    li1.appendChild(quizzesDiv);
    li2.appendChild(pollsDiv)
    li3.appendChild(feedbacksDiv)
    ActionsDiv.appendChild(li1)
    ActionsDiv.appendChild(li2)
    ActionsDiv.appendChild(li3)
    let PossibleActions = document.createElement("div")
    PossibleActions.classList.add("possible-actions")
    let but1 = document.createElement("button");
    let but2 = document.createElement("button");
    let but3 = document.createElement("button");
    but1.innerHTML = "+ Add Quiz";
    but2.innerHTML = "+ Add Poll";
    but3.innerHTML = "+ Add Feedback";
    but1.classList.add("main-button");
    but2.classList.add("main-button");
    but3.classList.add("main-button");
    but1.addEventListener("click", () => {
        if (checkEventExistance(event["_id"])) {
            if (window.confirm("An Event already exists, you will lose that data?")) {
                sessionStorage.setItem("event_id", event["_id"]);
                resetActionIds();
                performCheck();
                ActivateAction("quiz");
                goTo(quizSelector);
            }
        }
        else {
            sessionStorage.setItem("event_id", event["_id"]);
            resetActionIds("quiz");
            performCheck();
            ActivateAction("quiz");
            goTo(quizSelector);
        }
        sessionStorage.setItem("the_current_event", JSON.stringify(event));
        renderCurrentEventDeets();
    })
    but2.addEventListener("click", () => {
        if (checkEventExistance(event["_id"])) {
            /* dialog("An Event already exists, you will lose that data?"); */
            if (window.confirm("An Event already exists, you will lose that data?")) {
                sessionStorage.setItem("event_id", event["_id"]);
                resetActionIds();
                performCheck();
                ActivateAction("poll");
                goTo(pollSelector);
            }
        }
        else {
            sessionStorage.setItem("event_id", event["_id"]);
            resetActionIds("poll");
            performCheck();
            ActivateAction("poll");
            goTo(pollSelector);
        }
        sessionStorage.setItem("the_current_event", JSON.stringify(event));
        renderCurrentEventDeets();
    })
    but3.addEventListener("click", () => {
        if (checkEventExistance(event["_id"])) {
            /* dialog("An Event already exists, you will lose that data?"); */
            if (window.confirm("An Event already exists, you will lose that data?")) {
                sessionStorage.setItem("event_id", event["_id"]);
                resetActionIds();
                performCheck();
                ActivateAction("feedback");
                goTo(feedbackSelector);
            }
        }
        else {
            sessionStorage.setItem("event_id", event["_id"]);
            resetActionIds("feedback");
            performCheck();
            ActivateAction("feedback");
            goTo(feedbackSelector);
        }
        sessionStorage.setItem("the_current_event", JSON.stringify(event));
        renderCurrentEventDeets();
    })
    PossibleActions.appendChild(but1);
    PossibleActions.appendChild(but2);
    PossibleActions.appendChild(but3)
    EventBody.appendChild(ActionsDiv)
    EventBody.appendChild(PossibleActions)
    EventDiv.appendChild(EventBody);
    if (just == "just") {
        historyGrid.insertBefore(EventDiv, historyGrid.childNodes[1])
    }
    else {
        historyGrid.appendChild(EventDiv);
    }
    var elem = document.querySelectorAll('.collapsible.expandable');
    elem.forEach(ele => {
        var instance = M.Collapsible.init(ele, {
            accordion: false
        });
    })
}



let getActions = async (event) => {
    console.log(event)
    let actionDeets = [];
    const GatherActions = new Promise((resolve, reject) => {
        let i = 0;
        if (event["Actions"].length == 0) {
            resolve();
        }
        event["Actions"].forEach(action => {

            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("https://mighty-sea-62531.herokuapp.com/api/actions/getActiondetail/" + action, requestOptions)
                .then(response => response.json())
                .then(result => {
                    actionDeets.push(result);
                    i++;
                    if (i == event["Actions"].length) {
                        resolve();
                    }
                })
                .catch(error => console.log('error', error));
        })
    })
    GatherActions.then(() => {
        renderEventHistory(event, actionDeets);
        var elem = document.querySelector('.collapsible.expandable');
        var instance = M.Collapsible.init(elem, {
            accordion: false
        });
    })
}







let getEventDetails = () => {
    event_ids.forEach(event_id => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://mighty-sea-62531.herokuapp.com/api/events/getEventdetail/" + event_id, requestOptions)
            .then(response => response.json())
            .then(result => {
                getActions(result);
            })
            .catch(error => console.log('error', error));
    })
}



let handleHistory = () => {
    historyGrid.innerHTML = '<li class="event"><p><strong>Events</strong></p> <p><strong>Event Code</strong></p> <p><strong>No. of participants</strong></p> <p><strong></strong></p> </li>';
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
    addLoader(loginButton);
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
            popup("Logged In")
            removeLoader(loginButton, "Login")
        })
        .catch(error => {
            console.log('error', error)
            removeLoader(loginButton, "Login")
            popup("Invalid Credentials", "Error")
        });

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
    if (this.classList[1] != "home") {
        const thissummary = document.querySelector(`.${this.classList[1]}-summary`);
        thissummary.classList.toggle("show")
    }
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
let eventCreated = {};

function createEvent(e) {
    e.preventDefault();
    if (sessionStorage.getItem("event_id")) {
        if (window.confirm("An Event already exists, you will lose that data?")) {
            sessionStorage.removeItem("event_id")
            resetActionIds();
            performCheck();
            resetActionVariables();
        }
        else {
            return;
        }
    }
    addLoader(createEventBtn)
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
            removeLoader(createEventBtn, "Generate Event Code")
            sessionStorage.setItem("event_id", result._id);
            sessionStorage.setItem("the_current_event", JSON.stringify(result))
            renderCurrentEventDeets();
            AddActionDiv.classList.add("show");
            eventCreated = result;
            EventCodeDiv.innerHTML = `Event Code: ${result["Code"]}`;
            EventCodeDiv.classList.add("show");
            renderEventHistory(result, [], "just");
            popup("Event Generated");
        })
        .catch(error => {
            console.log('Event Error', error);
            removeLoader(createEventBtn, "Generate Event Code")
            popup("Event Generation Error", "Error")
        });

    disableBtn(createEventBtn);
}


function ActionRedirect(e) {
    if (this.innerHTML == "Quiz") {
        console.log("here man")
        if (checkEventExistance(eventCreated["_id"])) {
            console.log("asdlkfjasdlkfjdsalkfj")
            if (window.confirm("An Event already exists, you will lose that data?")) {
                sessionStorage.setItem("event_id", eventCreated["_id"]);
                sessionStorage.setItem("the_current_event", JSON.stringify(eventCreated));
                renderCurrentEventDeets();
                console.log("here")
            }
            else {
                return;
            }
        }
        sessionStorage.removeItem("quiz_action_id");
        performCheck()
        ActivateAction("quiz")
        goTo(quizSelector);
    }
    if (this.innerHTML == "Poll") {
        if (checkEventExistance(eventCreated["_id"])) {
            if (window.confirm("An Event already exists, you will lose that data?")) {
                sessionStorage.setItem("event_id", eventCreated["_id"]);
                sessionStorage.setItem("the_current_event", eventCreated);
                renderCurrentEventDeets();
            }
            else {
                return;
            }
        }
        sessionStorage.removeItem("poll_action_id");
        performCheck();
        ActivateAction("poll")
        goTo(pollSelector)
    }
    if (this.innerHTML == "Feedback") {
        if (checkEventExistance(eventCreated["_id"])) {
            if (window.confirm("An Event already exists, you will lose that data?")) {
                sessionStorage.setItem("event_id", eventCreated["_id"]);
                sessionStorage.setItem("the_current_event", eventCreated);
                renderCurrentEventDeets();
            }
            else {
                return;
            }
        }
        sessionStorage.removeItem("feedback_action_id");
        performCheck();
        ActivateAction("feedback")
        goTo(feedbackSelector)
    }
}



const actionRedirectBtn = document.querySelectorAll(".action-redirect");
actionRedirectBtn.forEach(ele => {
    ele.addEventListener("click", ActionRedirect)
})

createEventBtn.addEventListener("click", createEvent)


/* Adding Events: End */






/* Adding Actions */



function AddAction(e) {
    e.preventDefault();
    addLoader(this);
    const name = document.querySelector(`#${this.classList[2]}_name`);
    const action_data = {
        action_type: this.classList[2],
        title: name.value
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
            document.querySelector(`.${this.classList[2]}-name`).classList.remove("show-action")
            document.querySelector(`.${this.classList[2]}-internal`).classList.add("show-action");

            name.value = "";

            if (this.classList[2] == "Quiz") {
                popup("Quiz Added")
                sessionStorage.setItem("quiz_action_id", result._id);
                console.log(sessionStorage.getItem("quiz_action_id"))
                sessionStorage.setItem("quiz-Title", result["title"]);
                removeLoader(this, "Make Quiz")
            }
            if (this.classList[2] == "Poll") {
                popup("Poll Added")
                sessionStorage.setItem("poll_action_id", result._id)
                sessionStorage.setItem("poll-Title", result["title"])
                removeLoader(this, "Make Poll")
            }
            if (this.classList[2] == "Feedback") {
                popup("Feedback Added")
                sessionStorage.setItem("feedback_action_id", result._id)
                sessionStorage.setItem("feedback-Title", result["title"]);
                removeLoader(this, "Make Feedback")
            }
            handleHistory();
        })
        .catch(error => {
            console.log('Action Error', error);
            popup("Error Adding Action", "Error")
        });
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
    let questionName = document.querySelector("#poll_name");
    let Form = document.querySelector("#poll_form");
    if (questionName == "") {
        questionName.classList.add("Opt-match");
        questionName.placeholder = "Question is required";
    }
    else {
        questionName.classList.remove("Opt-match");
        questionName.placeholder = "Enter Question";
        let f = 0;
        questionOptions.forEach(ele => {
            if (ele.value == "") {
                ele.classList.add("Opt-match");
                ele.placeholder = "Option Required"
                f++;
            }
        })
        if(f == 0){
            let question = {};
            question.name = questionName.value;
            question.options = [];
            questionOptions.forEach(ele => {
                ele.classList.remove("Opt-match");
                ele.placeholder = "Enter Option";
                let opti = {
                    option: ele.value
                }
                question.options.push(opti);
            })
            if (this.value) {
                pollQuestionsData.splice(this.value, 1, question);
                console.log(pollQuestionsData);
                this.removeAttribute("value")
                this.innerHTML = "+ Add Poll Question";
                popup("Question Edited")
            }
            else {
                pollQuestionsData.push(question);
                console.log(pollQuestionsData)
                popup("Poll Question Added")
            }

            Form.reset()
        }
    }
}

const correctOptionDiv = document.querySelector("#correct_option");

let checkOptions = (options, correct) => {
    let flag = 0;
    options.forEach(opt => {
        if (opt.value == "") {
            opt.classList.add("Opt-match");
            opt.placeholder = "Option is Required"
        }
        else{
            opt.classList.remove("Opt-match");
            opt.placeholder = "Enter Option"
        }
        if (opt.value == correct) {
            flag++;
        }
    })
    if (correct == "") {
        correctOption.classList.add("Opt-match");
        correctOption.placeholder = "Correct Option is required";
    }
    if (flag == 0) {
        correctOptionDiv.value = "";
        correctOptionDiv.classList.add("Opt-match");
        correctOptionDiv.placeholder = "There are no options that match this"
        return false;
    }
    if (flag == 1) {
        correctOptionDiv.classList.remove("Opt-match");
        correctOptionDiv.placeholder = "Correct Option(must match an option)"
        return true;
    }
    if (flag > 1) {
        correctOptionDiv.value = "";
        correctOptionDiv.classList.add("Opt-match");
        correctOptionDiv.placeholder = "There are multiple options that match this"
        return false;
    }

}








const AddQuestionBtn = document.querySelector("#add_question_btn");
const AddPollBtn = document.querySelector("#add_poll_btn");
let questionsData = [];
let question_no = 0;
function addQuestion(e) {
    e.preventDefault();
    let questionOptions = document.querySelectorAll(".quiz-option");
    let questionName = document.querySelector("#question_name");
    let correctOption = document.querySelector("#correct_option").value;
    let Form = document.querySelector("#question_form");
    let quesVal = true;
    let corrVal = true;
    let optVal = true;
    if (questionName.value == "") {
        questionName.classList.add("Opt-match");
        questionName.placeholder = "Question is required";
        quesVal = false;
    }
    if (correctOption.value == "") {
        correctOption.classList.add("Opt-match");
        correctOption.placeholder = "Correct Option is required";
        corrVal = false;
    }
    optVal = checkOptions(questionOptions, correctOption.value)
    if (quesVal) {
        questionName.classList.remove("Opt-match")
        questionName.placeholder = "Enter Question";
    }
    if (corrVal) {
        correctOption.classList.remove("Opt-match")

        correctOption.placeholder = "Enter Correct Option";
    }
    if (quesVal && corrVal && optVal) {
        let question = {};
        question.name = questionName.value;
        question.correct = correctOption.value;
        question.options = [];
        questionOptions.forEach(ele => {
            ele.classList.remove("Opt-match")
            ele.placeholder = "Enter Option"
            let opti = {
                option: ele.value
            }
            question.options.push(opti);
        })
        if (this.value) {
            questionsData.splice(this.value, 1, question);
            console.log(questionsData);
            this.removeAttribute("value")
            this.innerHTML = "+ Add Question";
            popup("Question Edited")
        }
        else {
            questionsData.push(question);
            console.log(questionsData)
            popup("Quiz Question Added")
        }
        ReviewPage("quiz")
        Form.reset();
    }
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
    if (this.value) {
        feedbackQuestions.splice(this.value, 1, question);
        console.log(feedbackQuestions);
        this.removeAttribute("value")
        this.innerHTML = "+ Add Question";
        popup("Question Edited")
    }
    else {
        feedbackQuestions.push(question);
        console.log(feedbackQuestions)
        Form.reset();
        popup("Feedback Question Added")
    }

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
                if (questionNumber == (questions.length - 1)) {
                    nextQuestionBtn.classList.add("disable-btn");
                }
            }
            if (type == "poll") {
                socket.emit("next question", sessionStorage.getItem("poll_action_id"));
                if (questionNumber == (questions.length - 1)) {
                    nextPollBtn.classList.add("disable-btn");
                }
            }
            renderQuizDetails();
            popup("Next Question Live")
        })
        .catch(error => {
            console.log('error', error);
            popup("Next Question Error", "Error");
        });
}

nextQuestionBtn.addEventListener("click", () => {
    if (questionNumber > (questions.length - 2)) {
        popup("End of Quiz Questions", "Error");
    }
    else {

        nextQuestionTrue("quiz");
    }
});

nextPollBtn.addEventListener("click", () => {
    if (questionNumber > (questions.length - 2)) {
        popup("End of poll Questions", "Error")
    }
    else {
        nextQuestionTrue("poll");
    }
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
        renderQuizDetails();
        continueSocketConnection();
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

let resetStat = () => {
    let optionids = [];
    quiz_opts[questionNumber].forEach(opt => {
        optionids.push(opt["_id"]);
        opt["stat"] = 0;
    })
    socket.emit("reset options", optionids);
    renderQuizDetails();
    popup("Question Stats Reset");
}


const resetStatBtn = document.querySelectorAll(".reset-stat");
resetStatBtn.forEach(ele => {
    ele.addEventListener("click", resetStat);
})



let quiz_labels = [];
let quiz_data = [];
let temp = {};
let ctxa = document.querySelector('.quiz-details').getContext('2d');
let pollChart = document.querySelector('.poll-details').getContext('2d');
let MyChart = new Chart(ctxa, temp);
MyChart.canvas.parentNode.style.width = (0.87 * window.innerWidth) + "px";
MyChart.canvas.parentNode.style.height = (0.57 * window.innerHeight) + "px";
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
            },
            maintainAspectRatio: false
        }

    })
    MyChart.canvas.parentNode.style.width = (0.87 * window.innerWidth) + "px";
    MyChart.canvas.parentNode.style.height = (0.57 * window.innerHeight) + "px";

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
    nextQuestionBtn.classList.remove("disable-btn")
    nextPollBtn.classList.remove("disable-btn")
}


let updateStats = (type, id) => {
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
    if (type == "feedback") {
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
            let emitingData = [];
            if (type == "quiz") {
                emitingData.push(sessionStorage.getItem("quiz_action_id"));
                quiz_opts.forEach(ele => {
                    ele.forEach(opt => {
                        emitingData.push(opt["_id"]);
                    })
                })
                socket.emit("close quiz", emitingData);
                socket.disconnect();
                updateStats("quiz", sessionStorage.getItem("quiz_action_id"))
                popup("Quiz Closed")
                goTo(homeSelector);
                resetActionIds("quiz");
                resetActionVariables();
                performCheck();
            }
            if (type == "poll") {
                emitingData.push(sessionStorage.getItem("poll_action_id"));
                quiz_opts.forEach(ele => {
                    ele.forEach(opt => {
                        emitingData.push(opt["_id"]);
                    })
                })
                socket.emit("close quiz", emitingData);
                socket.disconnect();
                updateStats("poll", sessionStorage.getItem("poll_action_id"));
                popup("Poll Closed")
                goTo(homeSelector);
                resetActionIds("poll");
                resetActionVariables();
                performCheck();
            }
            if (type == "feedback") {
                popup("Feedback Closed")
                goTo(homeSelector);
                resetActionIds("feedback")
                resetFeedbackVariables();
                performCheck();
            }

        })
        .catch(error => {
            console.log('error', error);
            popup("Error in closing Action", "Error");
        });
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
        if (window.innerWidth > 600) {
            div.style.maxWidth = (0.5 * window.innerWidth) + "px";
        }
        else {

            div.style.maxWidth = (0.8 * window.innerWidth) + "px";
        }
        div.innerHTML = answer["option"];
        div.classList.add("answer")
        feedbackAnswerDiv.appendChild(div)
    })

}

if (feedbackNo == 0) {
    prevFeedbackBtn.classList.add("disable-btn")
}

nextFeedbackBtn.addEventListener("click", () => {
    prevFeedbackBtn.classList.remove("disable-btn")
    if (feedbackNo > (feedbackResultQuestions.length - 2)) {
        popup("End of Feedback Questions", "Error")
    }
    else {
        feedbackNo++;
        if (feedbackNo == (feedbackResultQuestions.length - 1)) {
            nextFeedbackBtn.classList.add("disable-btn");
        }
        renderFeedbackDeets(feedbackResultQuestions[feedbackNo], feedbackAnswers[feedbackNo]);
    }
})
prevFeedbackBtn.addEventListener("click", () => {
    nextFeedbackBtn.classList.remove("disable-btn");
    if (feedbackNo < 1) {
        popup("First Feedback Question")
    }
    else {
        feedbackNo--;
        if (feedbackNo == 0) {
            prevFeedbackBtn.classList.add("disable-btn")
        }
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
            .catch(error => {
                console.log('error', error);
                popup("Error in getting Feedback Answers", "Error");
            });
    })
}

let resetFeedbackVariables = () => {
    feedbackResultQuestions = [];
    feedbackAnswers = [];
    feedbackNo = 0;
    prevFeedbackBtn.classList.remove("disable-btn")
    nextFeedbackBtn.classList.remove("disable-btn");
    prevFeedbackBtn.classList.add("disable-btn");
}

const refreshBtn = document.querySelector(".refresh-btn");
refreshBtn.addEventListener("click", async () => {
    resetFeedbackVariables()
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
                createChart(ctxa, sessionStorage.getItem("quizTheme"));
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
            if (questionsData.length == 0) {
                popup("There are no questions to publish", "Error");
            }
            else {
                actid = sessionStorage.getItem("quiz_action_id");
                addLoader(this)
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
                            .then(result => { console.log(result); firstQuestionPublish(actid, "quiz"); removeLoader(this, "Publish Quiz") })
                            .catch(error => console.log('error', error));
                    })
                    .catch(error => console.log('error', error));
            }
        }
        else {
            console.log("no quiz made");
        }
    }
    if (this.id == "publish_poll") {
        if (sessionStorage.getItem("poll_action_id")) {
            if (pollQuestionsData.length == 0) {
                popup("There are no questions to publish", "Error");
            }
            else {
                actid = sessionStorage.getItem("poll_action_id");
                addLoader(this)
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
                            .then(result => { console.log(result); firstQuestionPublish(actid, "poll"); removeLoader(this, "Publish Poll") })
                            .catch(error => console.log('error', error));
                    })
                    .catch(error => console.log('error', error));

            }
        }
        else {
            console.log("no poll made");
        }
    }
    if (this.id == "publish_feedback") {
        if (sessionStorage.getItem("feedback_action_id")) {
            if (feedbackQuestions.length == 0) {
                popup("There are no questions to publish", "Error");
            }
            else {
                actid = sessionStorage.getItem("feedback_action_id");
                addLoader(this)
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
                            .then(result => { console.log(result); firstQuestionPublish(actid, "feedback"); removeLoader(this, "Publish Feedback") })
                            .catch(error => console.log('error', error));
                    })
                    .catch(error => console.log('error', error));
            }
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
        console.log("now here")
        quizSelector.forEach(ele => {
            ele.style.color = "rgb(189, 189, 189)";
            ele.removeEventListener("click", selectItem);
        })
        document.querySelector(".Quiz-internal").classList.remove("show-action");
        document.querySelector(".quiz-result").classList.remove("show-select");
        document.querySelector(".quiz-summary").classList.remove("show");
        document.querySelector(".quiz-create-container").classList.add("show-action");
        document.querySelector(".quiz-create-container").classList.remove("opacity-dec");
        document.querySelector(".quiz-create").classList.add("show-select");
        document.querySelector(".Quiz-name").classList.add("show-action");
        resetActionVariables();
    }
    if (!sessionStorage.getItem("poll_action_id")) {
        pollSelector.forEach(ele => {
            ele.style.color = "rgb(189, 189, 189)";
            ele.removeEventListener("click", selectItem);
        })

        document.querySelector(".Poll-internal").classList.remove("show-action");
        document.querySelector(".poll-result").classList.remove("show-select")
        document.querySelector(".poll-summary").classList.remove("show");
        document.querySelector(".poll-create-container").classList.add("show-action");
        document.querySelector(".poll-create-container").classList.remove("opacity-dec");
        document.querySelector(".poll-create").classList.add("show-select");
        document.querySelector(".Poll-name").classList.add("show-action");
        resetActionVariables()
    }
    if (!sessionStorage.getItem("feedback_action_id")) {
        feedbackSelector.forEach(ele => {
            ele.style.color = "rgb(189, 189, 189)"
            ele.removeEventListener("click", selectItem);
        })
        document.querySelector(".Feedback-internal").classList.remove("show-action");
        document.querySelector(".feedback-result").classList.remove("show-select")
        document.querySelector(".feedback-summary").classList.remove("show");
        document.querySelector(".feedback-create-container").classList.add("show-action");
        document.querySelector(".feedback-create-container").classList.remove("opacity-dec");
        document.querySelector(".feedback-create").classList.add("show-select");
        document.querySelector(".Feedback-name").classList.add("show-action");

    }
}
performCheck();




let addFormData = (i, type) => {
    console.log(i, type);
}


const formBtn = document.querySelectorAll(".form-btn");


let renderReviewPage = (type) => {
    let deetsDisplayDiv = document.querySelector(`.extra-${type}-deets`);
    let title = document.querySelector(`.${type}-title`);
    title.innerHTML = "Action Title: " + sessionStorage.getItem(`${type}-Title`);
    console.log(deetsDisplayDiv)
    deetsDisplayDiv.innerHTML = "";
    if (type == "quiz") {
        console.log(questionsData)
        let questionDeetsDiv;
        questionsData.forEach((question, i) => {
            questionDeetsDiv = document.createElement("div");
            questionDeetsDiv.classList.add("question-deets");
            let pSlno = document.createElement("p");
            pSlno.innerHTML = `${(i + 1)}.`;
            let pTitle = document.createElement("p");
            pTitle.innerHTML = `${question["name"]}`
            let Icons = document.createElement("div");
            Icons.classList.add("alt-icons")
            let icon1 = document.createElement("i")
            let icon2 = document.createElement("i")
            icon1.classList.add("material-icons");
            icon2.classList.add("material-icons");
            icon1.innerHTML = "delete";
            icon2.innerHTML = "mode_edit";
            icon1.addEventListener("click", () => {
                console.log(i);
                questionsData.splice(i, 1);
                console.log(questionsData)
                renderReviewPage("quiz");
            })
            icon2.addEventListener("click", () => {
                let form = document.querySelector(`.quiz-create-container`);
                let reviewControl = document.querySelector(`.quiz-summary`);
                form.reset();
                reviewControl.classList.remove("show");
                form.classList.add("show-action");
                form.classList.remove("opacity-dec")
                document.querySelector("#add_question_btn").innerHTML = "Insert Edited Question";
                document.querySelector("#add_question_btn").value = i;
            })
            Icons.appendChild(icon1);
            Icons.appendChild(icon2);
            questionDeetsDiv.appendChild(pSlno)
            questionDeetsDiv.appendChild(pTitle);
            questionDeetsDiv.appendChild(Icons);
            deetsDisplayDiv.appendChild(questionDeetsDiv)
        })

    }
    if (type == "poll") {
        console.log(pollQuestionsData)
        pollQuestionsData.forEach((question, i) => {
            let questionDeetsDiv = document.createElement("div");
            questionDeetsDiv.classList.add("question-deets");
            let pSlno = document.createElement("p");
            pSlno.innerHTML = `${(i + 1)}.`;
            let pTitle = document.createElement("p");
            pTitle.innerHTML = `${question["name"]}`
            let Icons = document.createElement("div");
            Icons.classList.add("alt-icons")
            let icon1 = document.createElement("i")
            let icon2 = document.createElement("i")
            icon1.classList.add("material-icons");
            icon2.classList.add("material-icons");
            icon1.innerHTML = "delete";
            icon2.innerHTML = "mode_edit";
            icon1.addEventListener("click", () => {
                pollQuestionsData.splice(i, 1);
                console.log(pollQuestionsData)
                renderReviewPage("poll");
            })
            icon2.addEventListener("click", () => {
                let form = document.querySelector(`.poll-create-container`);
                let reviewControl = document.querySelector(`.poll-summary`);
                form.reset();
                reviewControl.classList.remove("show");
                form.classList.add("show-action");
                form.classList.remove("opacity-dec")
                document.querySelector("#add_poll_btn").innerHTML = "Insert Edited Question"
                document.querySelector("#add_poll_btn").value = i;
            })
            Icons.appendChild(icon1);
            Icons.appendChild(icon2);
            questionDeetsDiv.appendChild(pSlno)
            questionDeetsDiv.appendChild(pTitle);
            questionDeetsDiv.appendChild(Icons);
            deetsDisplayDiv.appendChild(questionDeetsDiv)
        })
    }
    if (type == "feedback") {
        console.log(feedbackQuestions)
        feedbackQuestions.forEach((question, i) => {
            let questionDeetsDiv = document.createElement("div");
            questionDeetsDiv.classList.add("question-deets");
            let pSlno = document.createElement("p");
            pSlno.innerHTML = `${(i + 1)}.`;
            let pTitle = document.createElement("p");
            pTitle.innerHTML = `${question["name"]}`
            let Icons = document.createElement("div");
            Icons.classList.add("alt-icons")
            let icon1 = document.createElement("i")
            let icon2 = document.createElement("i")
            icon1.classList.add("material-icons");
            icon2.classList.add("material-icons");
            icon1.innerHTML = "delete";
            icon2.innerHTML = "mode_edit";
            icon1.addEventListener("click", () => {
                console.log(i);
                feedbackQuestions.splice(i, 1);
                console.log(feedbackQuestions)
                renderReviewPage("feedback");
            })
            icon2.addEventListener("click", () => {
                let form = document.querySelector(`.feedback-create-container`);
                form.reset();
                let reviewControl = document.querySelector(`.feedback-summary`);
                reviewControl.classList.remove("show");
                form.classList.add("show-action");
                form.classList.remove("opacity-dec")
                document.querySelector("#add_feedback_btn").innerHTML = "Insert Edited Question";
                document.querySelector("#add_feedback_btn").value = i;
            })
            Icons.appendChild(icon1);
            Icons.appendChild(icon2);
            questionDeetsDiv.appendChild(pSlno)
            questionDeetsDiv.appendChild(pTitle);
            questionDeetsDiv.appendChild(Icons);
            deetsDisplayDiv.appendChild(questionDeetsDiv)
        })
    }
}














function ReviewPage(e) {
    e.preventDefault();
    console.log(this.classList)
    let form = document.querySelector(`.${this.classList[1]}-create-container`);
    let reviewControl = document.querySelector(`.${this.classList[1]}-summary`);
    form.classList.add("opacity-dec");
    reviewControl.classList.add("show");
    renderReviewPage(this.classList[1]);
}




function FormPage() {
    let form = document.querySelector(`.${this.classList[1]}-create-container`);
    let reviewControl = document.querySelector(`.${this.classList[1]}-summary`);
    reviewControl.classList.remove("show");
    form.classList.remove("opacity-dec");
}






formBtn.forEach(ele => {
    ele.addEventListener("click", FormPage)
})



const eventNameDivs = document.querySelectorAll(".current-event-name")

const eventCodeDivs = document.querySelectorAll(".current-event-code")
let renderCurrentEventDeets = () => {
    let event = JSON.parse(sessionStorage.getItem("the_current_event"));
    eventNameDivs.forEach(ele => {
        ele.innerHTML = `Event Name: ${event["Name"]}`

    })
    eventCodeDivs.forEach(ele => {
        ele.innerHTML = `Event Code: ${event["Code"]}`;
    })
}
if (sessionStorage.getItem("the_current_event")) {
    renderCurrentEventDeets();
}




let addTheme = () => {
    if (sessionStorage.getItem("color")) {
        document.documentElement.style.setProperty('--main-color', sessionStorage.getItem("color"));
        document.documentElement.style.setProperty('--main-shadow-hover', `inset -6px -6px 10px ${sessionStorage.getItem("color")}, inset 6px 6px 20px rgba(0, 0, 0, 0.2)`)
    }
}
addTheme();





const overallThemeBtns = document.querySelectorAll(".overall-theme")

function chooseTheme() {
    if (this.id == "red_theme") {
        sessionStorage.setItem("color", "#EA4C89")
    }
    if (this.id == "orange_theme") {
        sessionStorage.setItem("color", "#F89224")
    }
    if (this.id == "blue_theme") {
        sessionStorage.setItem("color", "#2784FB")

    }
    if (this.id == "dark_theme") {
        sessionStorage.setItem("color", "#83D39D")
    }
    addTheme();
}

overallThemeBtns.forEach(ele => {
    ele.addEventListener("click", chooseTheme)
})









