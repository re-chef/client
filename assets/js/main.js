$(document).ready(function () {
    $('.search-recipes').keyup(function (e) {
        if (e.keyCode == 13) {
            $(".search-recipes").addClass("button-search");
            $(this).closest('form').submit();
        }
    })
})

function search(value) {
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
                console.log(html, 'html')
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

function getRecipe(values) {
    axios.get(`http://localhost:3000/recipes/${values}`)
        .then(({ data }) => {
            let str = ''
            for (let i = 0; i < data.recipe.ingredients.length; i++) {
                str += `<p>${data.recipe.ingredients[i]}</p>`
            }
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
                    <div>
                        <h3>Share on Social</h3>
                        <a href="#" class="fa fa-facebook"></a>
                        <a href="#" class="fa fa-twitter"></a>
                        <a href="#" class="fa fa-instagram"></a>
                        <a href="#" class="fa fa-pinterest"></a>
                        <a href="#" class="fa fa-tumblr"></a>
                    </div>
                </div>
                <div>
                    <button onclick="searchVideo('${data.recipe.title}')">YouTube</button>
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
                        <iframe src="https://www.youtube.com/embed/${item.id.videoId}" height="200" width="300"></iframe>
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