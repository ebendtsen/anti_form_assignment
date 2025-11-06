window.addEventListener('DOMContentLoaded', () => {
    const passwordMessage = document.getElementById('passwordMessage');
    const usernameMessage = document.getElementById('usernameMessage');

    // --- Password validation ---
    document.getElementById('password').addEventListener("input", (event) => {
        let passwordInput = event.target.value;
        // warn about length
        if (passwordInput.length < 8) {
            passwordMessage.innerText = "Password must be at least 8 characters long!";
        }
        else {
            passwordMessage.innerText = "";
        };
    });

    // --- Username validation ---
    document.getElementById('username').addEventListener("input", (event) => {
        let usernameInput = event.target.value;
        // check if there's an emoji
        if (!containsEmoji(usernameInput)) {
            usernameMessage.innerText = "Needs emoji";
        }
        else {
            usernameMessage.innerText = "";   
        };
    });

    // helper function to check for emojies
    function containsEmoji(str) {
        return /[\p{Extended_Pictographic}]/u.test(str)  // "Extended_Pictographic" = rexeg notation to find emojies.
    };

    // --- Cat paw animation to press the reset button ---
    function movePaw() {
        const catPaw = document.getElementById('catPaw');
        const resetButton = document.querySelector('button[type="reset"]');
        const warning = document.getElementById("userMessage");

        // set paw starting position on the bottom of the browser window
        const buttonRect = resetButton.getBoundingClientRect(); // get button position
        catPaw.style.display = "block";
        catPaw.style.position = "absolute";
        catPaw.style.left = (window.scrollX + buttonRect.left + buttonRect.width / 2 - catPaw.width / 2) + "px";
        catPaw.style.top = (window.screen.height) + "px"; // bottom of the window

        // warn user paw is imminent
        warning.innerText = `Uh oh watch out!`;
        warning.style.display = "block";

        // move paw to button
        setTimeout(() => {
            catPaw.style.transform = `translateY(-${window.screen.height - buttonRect.top}px)`;
        }, 500);

        // after animation, trigger a form reset and hide paw agian
        setTimeout(() => {
            resetButton.click();
            warning.innerText = "oopsie :3";
            catPaw.style.display = "none";
        }, 3000);

        setTimeout(() => {
            warning.style.display = "none";
        }, 5000);
    }

    // randomly trigger paw every 10-20 seconds
    function randomTrigger() {
        const delay = Math.floor(Math.random() * 10000 + 20000);
        setTimeout(() => {
            movePaw();
            randomTrigger();
        }, delay);
    }
    randomTrigger();

    // --- Submit form ---
    document.getElementById("signupForm").addEventListener("submit", (event) => {
        event.preventDefault();
        let isValid = true;
        const formData = new FormData(event.target);

        // check that password has at least one capital letter and number
        const password = formData.get("password");
        if (!(/[A-Z]/.test(password))) {
            isValid = false;
            passwordMessage.innerText = "password must have at least one capital letter";
        }
        else if (!(/[0-9]/.test(password))) {
            isValid = false;
            passwordMessage.innerText = "password must have at least one number";
        };

        // username must have one emoji and include 'meow'
        const username = formData.get("username");
        if (!containsEmoji(username)) {
            isValid = false;
            usernameMessage.innerText = "username must have at least one emoji";
        }
        else if (!(username.includes("meow"))) {
            isValid = false;
            usernameMessage.innerText = "username must include 'meow'";
        };

        // get phone number, birthday, and email
        const phoneNumbers = formData.getAll("phone"); // e.g. ["1","2","3",...]
        let phoneString = phoneNumbers.join(''); 
        if (!(/[1-9]/.test(phoneString))) {
            phoneString = "no number given";
        };

        const email = formData.get("email");
        const birthday = formData.get("birthday");
        const subscribed = formData.get("newsletter");

        // if one condition is invalid submission failed
        if (!isValid) {
            document.querySelector('button[type="reset"]').click();
            alert("Almost had it!");
        }
        else {
            // print user information to console
            alert(`Welcome to anime cats club ${username}!`);
            console.log(`User info:
                username: ${username}
                password: ${password}

                email: ${email}
                tel: ${phoneString}
                birthday: ${birthday}
                subscribed to newsletter: ${subscribed ? "yes" : "no"}`);
        };
    });

});