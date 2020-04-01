


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
    const invBtn = document.querySelector(`#${this.id}_btn`)
    invBtn.classList.add("show");
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
    const invBtn = document.querySelector(`#${ele.id}_btn`)
    invBtn.classList.add("show");
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

        fetch("https://mighty-sea-62531.herokuapp.com/api/events/getEventdetail/"+event_id, requestOptions)
            .then(response => response.json())
            .then(result => {event_deets.push(result); renderEventDeets();})
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
    /* if(this.id === "quiz"){

    } */
}

invertBtn.forEach(ele => {
    ele.addEventListener("click", handleInvert);
})

/* Handling inverting between create and results page: End*/
























