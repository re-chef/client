$(document).ready(function () {
    $('.search-recipes').keyup(function (e) {
        if (e.keyCode == 13) {
            $(".search-recipes").addClass("button-search");
            $(this).closest('form').submit();
        }
    })
})

function searchRecipe(value) {
    if (localStorage.getItem('token') == null) {
        swal('Please login with your Google Account')
    } else {
        let page = 'http://localhost:3000/recipes'

        if (value) {
            page = `http://localhost:3000/recipes/search?recipes=${value}`
        }

        $.ajax({
            url: page,
            method: 'GET'
        })
            .done(function (list) {
                let html = ''
                if (list.count == 0) {
                    html = '404 - RECIPE NOT FOUND'
                    $('.notfound').empty()
                    $('.notfound').append(html)
                }

                for (let i = 0; i < list.recipes.length; i++) {
                    html += `
                    <div class="col-md-3 col-sm-6">
                        <div class="product-grid">
                            <div class="product-image">
                                <a href="#">
                                    <img class="pic-1" src="${list.recipes[i].image_url}">
                                </a>
                            </div>
                            <div class="product-content">
                                <h3 class="title"><a href="#" onclick="getRecipe('${list.recipes[i].recipe_id}')">${list.recipes[i].title}</a></h3>
                            </div>
                        </div>
                    </div>`
                }

                $('.row').empty()
                $('.row').append(html)
            })
    }
}

function translateIngredients(ingredients) {
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/translate',
        data: {
            text: ingredients
        }
    })
        .done(({ data }) => {
            let translated = data.split(',')
            let html = '<h3>Bahan</h3>'
            translated.forEach(p => {
                html += `<p>${p}</p>`
            })

            $('.recipe').empty()
            $('.recipe').html(html)

        })
        .fail(err => {
            console.log(err);

        })

}

function getRecipe(values) {
    axios.get(`http://localhost:3000/recipes/${values}`)

        .then(({ data }) => {
            let str = ''
            for (let i = 0; i < data.recipe.ingredients.length; i++) {
                str += `<p>${data.recipe.ingredients[i]}</p>`
            }
            const ingredients = data.recipe.ingredients.join(',').replace(/'/g, '');
            let html = `
        <div>
            <h1 class="product-title">${data.recipe.title}</h1>
        </div>
        <div id="product-page">
            <div class="product-container">
                <div class="product-image">
                    <img src="${data.recipe.image_url}" alt="${data.recipe.title}">
                </div>
                <div class="information">
                    <div class="publisher">
                        <h3>Publisher</h3>
                        <p>${data.recipe.publisher}</p>
                    </div>
                    <div class="social-rank">
                        <h3>Social Rank</h3>
                        <p>${data.recipe.social_rank}</p>
                    </div>
                    <div class="row">
                        <div class="col s6">
                        <button class="waves-effect waves-light btn-large" onclick="searchVideo('${data.recipe.title}')">YouTube</button>
                        </div>
                        <div class="col s6">
                        <button class="waves-effect waves-light btn-large" onclick="translateIngredients('${ingredients}')">translate</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="recipe">
            <h3>Ingredients</h3>
            <div>${str}</div>
        </div>
        `
            $('.row').empty()
            $('.row').append(html)
        })
        .catch((error) => {
            console.log(error)
        })
}

function searchVideo(value) {
    let url = `http://localhost:3000/video?search=${value}`

    $.ajax({
        url: url,
        method: 'GET'
    })
        .done(respone => {
            try {
                var video = `<div class="row">`
                var BreakException = {}
                respone.data.items.forEach((item, index) => {
                    if (index === 3) {
                        video += `</div>`
                        throw BreakException
                    } else {
                        video += `<div class="col s4" style="text-align:center">
                        <iframe src="https://www.youtube.com/embed/${item.id.videoId}" height="200"
                        width="300"
                        allowfullscreen="allowfullscreen"
                        mozallowfullscreen="mozallowfullscreen"
                        msallowfullscreen="msallowfullscreen"
                        oallowfullscreen="oallowfullscreen"
                        webkitallowfullscreen="webkitallowfullscreen">
                        ></iframe>
                        <br>
                        <a href=https://www.youtube.com/watch?v=${item.id.videoId}>${item.snippet.title}</a>
                        <br>
                        </div>`
                    }
                })
            } catch (e) {
                if (e !== BreakException) throw e;
            }

            $('.row').empty()
            $('.row').html(video)
        })
        .fail(err => {
            console.log(err);

        })
}


// //google signin
function onSignIn(googleUser) {
    console.log('masuk sini');

    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'POST',
        url: `http://localhost:3000/user/googleSignIn`,
        data: {
            id_token: id_token
        }
    })
        .done(response => {
            console.log(response.data.first_name);

            localStorage.setItem('token', response.token)
            swal(`Welcome to Re-Chef, ${response.data.first_name} ${response.data.last_name}`)
        })
        .fail(err => {
            console.log(err);
        })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    localStorage.removeItem('token')
    $('.row').empty()
    swal('See youu..')
}