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

            // If there is no change and the product have been purchased
            if (moneyChange === 0 && !pickUpProduct){
                takeMoney($(this));
                resetSelectors();
            // If there is change to release but no product to release
            } else if (moneyChange > 0 && !pickUpProduct){
                $('.change-box').text('');
                takeMoney($(this));
                resetSelectors();
            }
        });

        // Cancell button 
        $('.money-panel__cancel').on('click', function(){
            isCanceled = true;
            productSelected = null;
            $('.change-panel').removeClass('active');
            $('.vending-message').text('');
            resetMoney();
            resetSelectors();
            
        });
    }

    // This will activate the product selectors
    function activateSelectors(){
        $('.product-selector').on('click', function(){
            productSelected = $(this).attr('data-selector');
            productPrice = $('[id="' + productSelected + '"]').attr('data-price');
            productLeft = $('[id="' + productSelected + '"]').attr('data-quantity');
            productImage = $('[id="' + productSelected + '"] .product-image').attr('src');
            $('.product-door img').attr('src', productImage);
            $('.product-selector').removeClass('selected');
            $(this).addClass('selected');

            // if there is no money added to the machine
            if (!moneyAdded || moneyAdded && moneyAdded < productPrice){
                $('.product-selector').removeClass('selected');
                $('.vending-message').text('You need ' + '$' + productPrice + ' for that one :)');
                $('.change-box').text((moneyAdded).toFixed(2));
                resetSelectors();

            // if there is money in the machine
            } else if (moneyAdded && moneyAdded > productPrice){

                // if the quantity of product is 0
                if(productLeft < 1){
                    $('.vending-message').text('Sorry that guy took the last one :(');
                    $('.product-selector').removeClass('selected');
                    productSelected = null;
                    resetSelectors();
                    $('.change-box').text((moneyAdded).toFixed(2));

                // if there is product left
                } else {
                    processProduct();
                }
            // if the money added is the needed for the new product
            } else if (moneyAdded && moneyAdded == productPrice){
                if(productLeft > 0){
                    processPayment();
                    updateDatabase();
                    resetBasicElements();
                } else {
                    $('.vending-message').text('Sorry that guy took the last one :(');
                    $('.product-selector').removeClass('selected');
                    productSelected = null;
                    resetSelectors();
                    $('.change-box').text((moneyAdded).toFixed(2));
                }
            }
        });
    }

    // Will process they money and change in order to get the product
    function processProduct(){

        // if the money is the needed or more
        if(moneyAdded && moneyAdded >= productPrice){

            // if the money is more than needed
            if(moneyAdded > productPrice){
                moneyChange = (moneyAdded - productPrice).toFixed(2);
                $('.change-box').text(moneyChange);

                // if the product quantity is more or equal to 1
                if(productLeft >= 1){
                    $('.change-panel').addClass('active');
                    $('.change-box').on('click', function(){

                        // if there is product left and product selected
                        if(productLeft && productSelected && moneyAdded > productPrice){
                            $('.vending-message').text('Thank you! Enjoy!');
                            processPayment();
                            updateDatabase();
                            resetBasicElements();

                        // if there is no product left or product not selected
                        } else {
                            $('.vending-message').text('');
                            resetSelectors();
                            resetMoney();
                        }
                    });

                    $('.vending-message').text('Take your change to complete the transaction');

                // if product is less than 1
                } else {
                    $('.vending-message').text('Please select other product or cancel :)');
                }

            // if the money is exaclty the needed for the product
            } else if (moneyAdded == productPrice){
                $('.vending-message').text('Thank you! Enjoy!');
                processPayment();
                updateDatabase();
                resetBasicElements();
            }

        // if there is not enough money for the selected product
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

        // product door button
        $('.product-door').addClass('active').on('click', function(){
            completeProcess();
        });
    }

    // will update the database asking for the name of the product and substracting one (this will happen in the database)
    function updateDatabase(){
        $.ajax({
            type: 'POST',
            data: {name: productSelected},
            url: '/getproduct',
            dataType: 'JSON',
            success: function (response) {
                console.log('Mongodb updated ' + response[0].name + ' quantity to ' + response[0].quantity);
            },
            error: function (errorThrown) {
                console.log('error ' + errorThrown);
            }
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

    // get and process the money
    function takeMoney($money){
        moneyAdded += (parseInt($money.attr('data-value'))/100);
        $('.vending-message').text('');
        $('.product-selector').removeClass('selected');
        $('.money-added').text((moneyAdded).toFixed(2));
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

    // Reset variables to original values
    function resetBasicElements(){
        productSelected = null;
        productPrice = null;
        productLeft  = null;
        productImage = null;
        isCanceled = false;
        moneyChange = 0;
        moneyAdded = 0;
    }

    // exposing init function
    return {
        init: init
    };

})($);