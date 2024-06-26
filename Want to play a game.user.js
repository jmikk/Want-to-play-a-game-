// ==UserScript==
// @name         Want to play a game?
// @namespace    http://tampermonkey.net/
// @version      3
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


        const figures = document.querySelectorAll('.back');
    figures.forEach(function(figure) {
        figure.textContent = 'Want to play a game? Click me to flip a card and get the localID to gift it to 9006 if you guess the id wrong!'; // Change text for all matching elements
    });






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

    // Function to extract localid from the fetched page
    function extractLocalId(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const localIdInput = doc.querySelector('input[name="localid"]');
        return localIdInput ? localIdInput.value : null;
    }

    // Function to handle the click event on a card
    function handleCardClick(event) {
        // Prevent the default action to "flip" the card
        event.preventDefault();

        // Get the card element
        const card = event.currentTarget;

        // Extract the card ID and season from the card element's data attributes
        const cardId = card.getAttribute('data-cardid');
        const season = card.getAttribute('data-season');

        // Prompt the user to guess the card ID
        const guess = prompt('Guess the ID of this card: If you get this wrong it will gift 9006 the card.');

        // Check if the guess is correct
        if (guess !== cardId) {
            // If the guess is incorrect, first fetch the page to get localid
            const getUrl = `https://www.nationstates.net/page=deck/card=${cardId}/season=${season}/gift=1`;

            GM_xmlhttpRequest({
                method: "GET",
                url: getUrl,
                onload: function(response) {
                    const localId = extractLocalId(response.responseText);
                    if (localId) {
                        // Make the POST request with localid, entity_name, and send_gift
                        const postUrl = `https://www.nationstates.net/page=deck/card=${cardId}/season=${season}`; // Replace with your actual POST request URL
                        const data = `localid=${localId}&entity_name=9006&send_gift=1`;

                        GM_xmlhttpRequest({
                            method: "POST",
                            url: postUrl,
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            data: data,
                            onload: function(response) {
                                // Handle the response from the server
                                console.log('POST Request made to: ' + postUrl);
                                console.log('Response:', response.responseText);
                                const wrongOverlay = createWrongOverlay();
                                card.appendChild(wrongOverlay);
                            }
                        });
                    } else {
                        console.error("Failed to extract localid.");
                    }
                }
            });
        } else {
            // If the guess is correct, notify the user
            alert('Congratulations! You guessed the correct ID.');
        }
        // Remove the event listener to prevent further clicks
        card.removeEventListener('click', handleCardClick);
    }

    // Add click event listeners to all card elements
    const cards = document.querySelectorAll('.deckcard-container .deckcard');
    cards.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });
})();
