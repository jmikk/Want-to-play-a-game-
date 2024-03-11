// ==UserScript==
// @name         Want to play a game?
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  THIS SCRIPT WILL JUNK CARDS IF YOU GUESS WRONG
// @author       9003
// @match        https://www.nationstates.net/page=deck*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';
        // Check if "Tap cards to reveal..." is present on the page
    if (!document.body.textContent.includes("Tap cards to reveal...")) {
        console.log("The script will not run as the required text is not found.");
        return; // Exit the script if the text is not found
    }






//THIS SCRIPT WILL JUNK CARDS IF YOU GUESS WRONG

//IF SOMEONE GAVE YOU THIS SCRIPT YOU NEED TO KNOW IT WILL JUNK CARDS INCLUDING LEGENDARIES.










        // Function to prompt for and store the user agent if it's not already set
    function getUserAgent() {
        let userAgent = GM_getValue('userAgent');
        if (!userAgent) {
            userAgent = prompt('Enter your User Agent: THIS SCRIPT WILL JUNK CARDS IF YOU GUESS WRONG. You have been warned and I will laugh if you junk a legendary.');
            GM_setValue('userAgent', userAgent);
        }
        return userAgent;
    }







    function createWrongOverlay() {
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.color = 'red';
        overlay.style.fontSize = '2em';
        overlay.style.zIndex = '10';
        overlay.innerText = 'WRONG';
        return overlay;
    }

    // Function to handle the click event on a card
    function handleCardClick(event) {
        // Call getUserAgent to ensure we have a User Agent set before continuing
        const userAgent = getUserAgent();
        // Prevent the default action to "flip" the card
        event.preventDefault();

        // Get the card element
        const card = event.currentTarget;

        // Extract the card ID and season from the card element's data attributes
        const cardId = card.getAttribute('data-cardid');
        const season = card.getAttribute('data-season');

        // Prompt the user to guess the card ID
        const guess = prompt('Guess the ID of this card:');

        // Check if the guess is correct
        if (guess !== cardId) {
            // If the guess is incorrect, display the "WRONG" overlay permanently
            const wrongOverlay = createWrongOverlay();
            card.appendChild(wrongOverlay);

            // Remove event listener to prevent further clicks
            card.removeEventListener('click', handleCardClick);

            // Make the AJAX request
            const timestamp = new Date().getTime(); // Get current timestamp
            const url = `https://www.nationstates.net/page=ajax3/a=junkcard/card=${cardId}/season=${season}/User_agent=${userAgent}/Script=Do_you_want_to_play_a_game/Author_discord=9003/Author_main_nation=9003/timestamp=${timestamp}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    // Handle the response from the server
                    console.log('Request made to: ' + url);
                    console.log('Response:', response.responseText);
                }
            });
        } else {
            // If the guess is correct, notify the user
            alert('Congratulations! You guessed the correct ID.');
            card.removeEventListener('click', handleCardClick);
        }
    }

    // Add click event listeners to all card elements
    const cards = document.querySelectorAll('.deckcard-container .deckcard');
    cards.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });
})();
