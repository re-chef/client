$(document).ready(function() {
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

    console.log(page, 'page')
    console.log(value, 'value')
    $.ajax({
        url: page,
        method: 'GET'
    }) 
    .done(function(list) {
        let html = ''
        if (list.count == 0) {
            html = '404 - RECIPE NOT FOUND'
            console.log(html, 'html')
            $('.notfound').empty()
            $('.notfound').append(html)
        }
        console.log(list, 'list')
        console.log(list.length)
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
                        <h3 class="title"><a href="#">${list.recipes[i].title}</a></h3>
                    </div>
                </div>
            </div>`
        } 
        console.log(html, 'html')
        $('.row').empty()
        $('.row').append(html)
    })
}