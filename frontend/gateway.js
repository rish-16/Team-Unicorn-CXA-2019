document.getElementById('DOMContentLoaded', () => {
    stripe.redirectToCheckout({
        items: [
          // Replace with the ID of your SKU
          {sku: 'sku_123', quantity: 1}
        ],
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        submitType: 'donate',
    }).then(function (result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
    });
})