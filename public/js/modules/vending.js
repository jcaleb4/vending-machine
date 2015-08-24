var vending = vending || {};
/**
 * Initializes the vending machine module
 */
vending.machine = (function ($) {
    var productSelected,
        productPrice,
        productLeft,
        productImage,
        isCanceled = false,
        pickUpProduct = false,
        moneyChange = 0,
        moneyAdded = 0;

    /**
     * Inits the vending module
     */
    function init() {
        // ready to select elements
        activateSelectors();
        // ready to receive money
        getMoney();
    }

    // get money from user
    function getMoney(){
        $('.money-item').on('click', function(){
            if (moneyChange === 0 && !pickUpProduct){
                $('.vending-message').text('');
                $('.product-selector').removeClass('selected');
                moneyAdded += (parseInt($(this).attr('data-value'))/100);
                $('.money-added').text((moneyAdded).toFixed(2));
            }
        });

        $('.money-panel__cancel').on('click', function(){
            isCanceled = true;
            productSelected = null;
            $('.change-panel').removeClass('active');
            $('.vending-message').text('');
            resetMoney();
            resetSelectors();
            
        });
    }

    function activateSelectors(){
        $('.product-selector').on('click', function(){
            productSelected = $(this).attr('data-selector');
            productPrice = $('[id="' + productSelected + '"]').attr('data-price');
            productLeft = $('[id="' + productSelected + '"]').attr('data-quantity');
            productImage = $('[id="' + productSelected + '"] .product-image').attr('src');
            $('.product-door img').attr('src', productImage);
            $('.product-selector').removeClass('selected');
            $(this).addClass('selected');

            if (!moneyAdded){
                $('.product-selector').removeClass('selected');
                $('.vending-message').text('You need ' + '$' + productPrice + ' for that one :)');

                resetSelectors();
            } else {
                // if the quantity of product is 0
                if(productLeft < 1){
                    $('.vending-message').text('Sorry that guy took the last one :(');
                    $('.product-selector').removeClass('selected');
                    productSelected = null;
                    resetSelectors();
                    $('.change-box').text((moneyAdded).toFixed(2));
                } else {
                    processProduct();
                }
            }
            
        });
    }

    function processProduct(){
        // if the money is the needed or more
        if(moneyAdded && moneyAdded >= productPrice){
            if(moneyAdded > productPrice){
                moneyChange = (moneyAdded - productPrice).toFixed(2);
                $('.change-box').text(moneyChange);

                if(productLeft > 0){
                    $('.change-panel').addClass('active');
                    $('.change-box').on('click', function(){
                        if(productLeft && productSelected){
                            $('.vending-message').text('Thank you! Enjoy!');
                            processPayment();
                            updateDatabase();
                            resetBasicElements();
                        } else {
                            $('.vending-message').text('');
                            resetSelectors();
                            resetMoney();
                        }
                    });

                    $('.vending-message').text('Take your change to complete the transaction');
                } else {
                    $('.vending-message').text('Please select other product or cancel :)');
                }

            // if there is not enough money for the selected product
            } else if (moneyAdded == productPrice){
                $('.vending-message').text('Thank you! Enjoy!');
                processPayment();
                updateDatabase();
            }
        } else {
            $('.product-selector').removeClass('selected');
            $('.vending-message').text('You need ' + '$' + productPrice + ' for that one :)');
        }
    }

    // Process the payment activating some elements to get users attention 
    function processPayment(){
        $('.product-name').val(productSelected);
        $('[id="' + productSelected + '"] .products-list__quantity').text((productLeft - 1) + ' left');
        $('[id="' + productSelected + '"]').attr('data-quantity', productLeft - 1);
        $('.products-panel').addClass('disable');
        $('.product-selector').removeClass('selected');
        $('.product-door .product').addClass('active');
        $('.product-door .door-text').text('Take your product');
        resetMoney();
        resetSelectors();
        pickUpProduct = true;
        $('.product-door').addClass('active').on('click', function(){
            completeProcess();
        });
    }

    function updateDatabase(){
        $.ajax({
            type: 'POST',
            data: {name: productSelected},
            url: '/getproduct',
            dataType: 'JSON'
        }).done(function( response ) {
            console.log('Mongodb updated ' + response[0].name + ' quantity to ' + response[0].quantity);
        });
    }

    // resets the money and text related values
    function resetMoney(){
        moneyAdded = 0;
        moneyChange = 0;
        resetSelectors();
        $('.change-box').text('');
        $('.money-added').text('add some money');
    }

    // reset selectors at some points
    function resetSelectors(){
        $('.change-panel').removeClass('active');
        $('.product-selector').removeClass('selected');
    }

    // submits the form to update the database
    function completeProcess(){
        pickUpProduct = false;
        $('.vending-message').text('');
        $('.product-door').removeClass('active');
        $('.product-door .product').removeClass('active');
        $('.product-door .door-text').text('');
        $('.products-panel').removeClass('disable');

        resetBasicElements();
    }

    function resetBasicElements(){
        productSelected = null;
        productPrice = null;
        productLeft  = null;
        productImage = null;
        isCanceled = false;
        moneyChange = 0;
        moneyAdded = 0;
    }

    return {
        init: init
    };

})($);