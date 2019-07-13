document.addEventListener('DOMContentLoaded', () => {
    console.log('Marketplace loaded')

    const market = document.getElementById('sandbox')
    
    const gateway = document.createElement('gateway')
    const gatewayTitle = document.createElement('gw-title')
    const gatewayPrice = document.createElement('gw-price')

    const promo = document.getElementById('promo')
    promo.onclick = () => {
        window.open('https://dashboard.stripe.com/dashboard', '_blank');
    }

    var Product = function(name, desc, price) {
        this.name = name;
        this.desc = desc
        this.price = price
    }

    Product.prototype.render = function(container) {
        var card = document.createElement('div')
        card.classList = 'product-card'

        var cardTop = document.createElement('div')
        cardTop.classList = 'product-top'

        var cardBtm = document.createElement('div')
        cardBtm.classList = 'product-bottom'

        var title = document.createElement('p')
        title.innerHTML = this.name
        title.classList = 'product-title'

        var desc = document.createElement('p')
        desc.innerHTML = this.desc
        desc.classList = 'product-desc'

        var prices = document.createElement('div')
        prices.classList = 'product-prices'

        var cost = document.createElement('p')
        cost.classList = 'product-cost'
        cost.innerHTML = this.price.toString() + '<span style="font-size: 15px;color:lightgray;padding-left: 5px;">/kg</span>'

        card.appendChild(cardTop)
        cardBtm.appendChild(title)
        cardBtm.appendChild(desc)
        prices.appendChild(cost)
        cardBtm.appendChild(prices)
        card.appendChild(cardBtm)
        container.appendChild(card)

        card.onclick = () => {
            console.log('hello')
            this.checkout(this.name, this.price)
        }
    }   

    Product.prototype.checkout = function(name, price) {
        gateway.style.display = 'block'
        gatewayTitle.innerHTML = name
        gatewayPrice.innerHTML = price
    }

    var products = [['Wood', 'This is a description of the product', 45], ['Plastics', 'This is a description of the product', 45], ['Gray Silk', 'This is a description of the product', 45], ['Crankshaft', 'This is a description of the product', 45]]
    for (var i=0; i < products.length; i++) {
        var cur = products[i]
        var prdt = new Product(cur[0], cur[1], cur[2])
        prdt.render(market)
    }

    // var DBref = firebase.database().ref()
})