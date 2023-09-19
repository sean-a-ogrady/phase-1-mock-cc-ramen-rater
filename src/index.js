/*
CORE DELIVERABLES
-----------------
1. See all ramen images in the div with the id of ramen-menu.
When the page loads, request the data from the server to get all the ramen objects.
Then, display the image for each of the ramen using an img tag inside the #ramen-menu div.

2. Click on an image from the #ramen-menu div and see all the info about that ramen
displayed inside the #ramen-detail div and where it says insert comment here and insert
rating here.

3. Create a new ramen after submitting the new-ramen form. The new ramen should be added to
the#ramen-menu div. The new ramen does not need to persist; in other words, if you refresh
the page, it's okay that the new ramen is no longer on the page.

ADVANCED DELIVERABLES
------------------
4. See the details for the first ramen as soon as the page loads (without clicking on an image)

5. Update the rating and comment for a ramen by submitting a form. Changes should be reflected
on the frontend. No need to persist. 

6. Delete a ramen (you can add a "delete" button if you'd like, or use an existing element to
handle the delete action). The ramen should be removed from the ramen-menu div, and should not
be displayed in the ramen-detail div. No need to persist.
*/


const url = "http://localhost:3000/ramens"

let idCount = 0;

// Selectors
const ramenMenu = document.querySelector("#ramen-menu");
const detailImage = document.querySelector(".detail-image")
const detailName = document.querySelector("h2.name");
const detailRestaurant = document.querySelector("h3.restaurant");
const ratingDisplay = document.querySelector("#rating-display");
const commentDisplay = document.querySelector("#comment-display");

// Edit Ramen Form Selectors
/*
NOTE TO INSTRUCTOR
------------------
The id's for the code provided in the github repo for the edit ramen
form were the same as the ids for the new ramen form. I've changed the
ids in the edit-ramen form. This might be worth updating in the GitHub
repo.

new-rating => edit-rating
new-comment => edit-coment
*/
const editRamen = document.querySelector("#edit-ramen");
const editRating = document.querySelector("#edit-rating");
const editComment = document.querySelector("#edit-comment");

// New Ramen Form Selectors
const newRamenForm = document.querySelector("#new-ramen");
const newName = document.querySelector("#new-name");
const newRestaurant = document.querySelector("#new-restaurant");
const newImage = document.querySelector("#new-image");
const newRating = document.querySelector("#new-rating");
const newComment = document.querySelector("#new-comment");

// DELIVERABLE 1

fetch(url)
.then(response => response.json())
.then(ramens => ramens.forEach(ramen => displayRamenImage(ramen)));

function displayRamenImage(ramen) {
    const newRamenImg = document.createElement("img");
    newRamenImg.src = ramen.image;
    newRamenImg.alt = ramen.name;
    newRamenImg.id = "img" + ramen.id;
    // DELIVERABLE 2
    newRamenImg.addEventListener('click', () => {
        displayRamenDetails(ramen);
    });
    // DELIVERABLE 4
    if (idCount === 0) displayRamenDetails(ramen);
    ramenMenu.appendChild(newRamenImg);
    idCount++;
}

function displayRamenDetails(ramen) {
    detailImage.src = ramen.image;
    detailName.textContent = ramen.name;
    detailRestaurant.textContent = ramen.restaurant;
    ratingDisplay.textContent = ramen.rating;
    commentDisplay.textContent = ramen.comment;
    detailName.id = ramen.id;
}

// DELIVERABLE 3
newRamenForm.addEventListener("submit", event => {
    event.preventDefault();
    fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            id: ++idCount,
            name: newName.value,
            restaurant: newRestaurant.value,
            image: newImage.value,
            rating: newRating.value,
            comment: newComment.value
        })
    })
    .then(response => {
        if (response.ok){
            return response.json();
        } else {
            throw new Error("POST failed");
        }
    })
    .then(postedRamen => displayRamenImage(postedRamen))
});

// DELIVERABLE 5
editRamen.addEventListener("submit", event => {
    event.preventDefault();
    fetch(url + "/" + detailName.id, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            comment: editComment.value,
            rating: editRating.value
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("PATCH failed");
        }
    })
    .then(patchedRamen => displayRamenDetails(patchedRamen));
});

// DELIVERABLE 6
const deleteButton = document.querySelector("#delete-button");
deleteButton.addEventListener("click", () => {
    
    fetch(url + "/" + detailName.id, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(nothing => {
        document.querySelector("#img" + detailName.id).remove();
        displayRamenDetails(document.querySelector("#img1"));
    });
});