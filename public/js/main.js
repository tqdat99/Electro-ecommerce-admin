(function($) {
    "use strict"

    // Mobile Nav toggle
    $('.menu-toggle > a').on('click', function(e) {
        e.preventDefault();
        $('#responsive-nav').toggleClass('active');
    })

    // Fix cart dropdown from closing
    $('.cart-dropdown').on('click', function(e) {
        e.stopPropagation();
    });

    /////////////////////////////////////////

    // Products Slick
    $('.products-slick').each(function() {
        var $this = $(this),
            $nav = $this.attr('data-nav');

        $this.slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            infinite: true,
            speed: 300,
            dots: false,
            arrows: true,
            appendArrows: $nav ? $nav : false,
            responsive: [{
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                },
            ]
        });
    });

    // Products Widget Slick
    $('.products-widget-slick').each(function() {
        var $this = $(this),
            $nav = $this.attr('data-nav');

        $this.slick({
            infinite: true,
            autoplay: true,
            speed: 300,
            dots: false,
            arrows: true,
            appendArrows: $nav ? $nav : false,
        });
    });

    /////////////////////////////////////////

    // Product Main img Slick
    $('#product-main-img').slick({
        infinite: true,
        speed: 300,
        dots: false,
        arrows: true,
        fade: true,
        asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: 0,
        vertical: true,
        asNavFor: '#product-main-img',
        responsive: [{
            breakpoint: 991,
            settings: {
                vertical: false,
                arrows: false,
                dots: true,
            }
        }, ]
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
        $('#product-main-img .product-preview').zoom();
    }

    /////////////////////////////////////////

    // Input number
    $('.input-number').each(function() {
        var $this = $(this),
            $input = $this.find('input[type="number"]'),
            up = $this.find('.qty-up'),
            down = $this.find('.qty-down');

        down.on('click', function() {
            var value = parseInt($input.val()) - 1;
            value = value < 1 ? 1 : value;
            $input.val(value);
            $input.change();
            updatePriceSlider($this, value)
        })

        up.on('click', function() {
            var value = parseInt($input.val()) + 1;
            $input.val(value);
            $input.change();
            updatePriceSlider($this, value)
        })
    });

    var priceInputMax = document.getElementById('price-max'),
        priceInputMin = document.getElementById('price-min');

    priceInputMax.addEventListener('change', function() {
        updatePriceSlider($(this).parent(), this.value)
    });

    priceInputMin.addEventListener('change', function() {
        updatePriceSlider($(this).parent(), this.value)
    });

    function updatePriceSlider(elem, value) {
        if (elem.hasClass('price-min')) {
            console.log('min')
            priceSlider.noUiSlider.set([value, null]);
        } else if (elem.hasClass('price-max')) {
            console.log('max')
            priceSlider.noUiSlider.set([null, value]);
        }
    }

    // Price Slider
    var priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
        noUiSlider.create(priceSlider, {
            start: [1, 999],
            connect: true,
            step: 1,
            range: {
                'min': 1,
                'max': 999
            }
        });

        priceSlider.noUiSlider.on('update', function(values, handle) {
            var value = values[handle];
            handle ? priceInputMax.value = value : priceInputMin.value = value
        });
    }

    $(function() {
        "use strict";

        //------- Parallax -------//
        skrollr.init({
            forceHeight: false
        });

        //------- Active Nice Select --------//
        $('select').niceSelect();

        //------- hero carousel -------//
        $(".hero-carousel").owlCarousel({
            items: 3,
            margin: 10,
            autoplay: false,
            autoplayTimeout: 5000,
            loop: true,
            nav: false,
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                810: {
                    items: 3
                }
            }
        });

        //------- Best Seller Carousel -------//
        if ($('.owl-carousel').length > 0) {
            $('#bestSellerCarousel').owlCarousel({
                loop: true,
                margin: 30,
                nav: true,
                navText: ["<i class='ti-arrow-left'></i>", "<i class='ti-arrow-right'></i>"],
                dots: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    900: {
                        items: 3
                    },
                    1130: {
                        items: 4
                    }
                }
            })
        }

        //------- single product area carousel -------//
        $(".s_Product_carousel").owlCarousel({
            items: 1,
            autoplay: false,
            autoplayTimeout: 5000,
            loop: true,
            nav: false,
            dots: false
        });

        //------- mailchimp --------//  
        function mailChimp() {
            $('#mc_embed_signup').find('form').ajaxChimp();
        }
        mailChimp();

        //------- fixed navbar --------//  
        $(window).scroll(function() {
            var sticky = $('.header_area'),
                scroll = $(window).scrollTop();

            if (scroll >= 100) sticky.addClass('fixed');
            else sticky.removeClass('fixed');
        });

        //------- Price Range slider -------//
        if (document.getElementById("price-range")) {

            var nonLinearSlider = document.getElementById('price-range');

            noUiSlider.create(nonLinearSlider, {
                connect: true,
                behaviour: 'tap',
                start: [500, 4000],
                range: {
                    // Starting at 500, step the value by 500,
                    // until 4000 is reached. From there, step by 1000.
                    'min': [0],
                    '10%': [500, 500],
                    '50%': [4000, 1000],
                    'max': [10000]
                }
            });


            var nodes = [
                document.getElementById('lower-value'), // 0
                document.getElementById('upper-value') // 1
            ];

            // Display the slider value and how far the handle moved
            // from the left edge of the slider.
            nonLinearSlider.noUiSlider.on('update', function(values, handle, unencoded, isTap, positions) {
                nodes[handle].innerHTML = values[handle];
            });

        }

    });




})(jQuery);

$(function() {
    "use strict";

    //------- Parallax -------//
    skrollr.init({
        forceHeight: false
    });

    //------- Active Nice Select --------//
    $('select').niceSelect();

    //------- hero carousel -------//
    $(".hero-carousel").owlCarousel({
        items: 3,
        margin: 10,
        autoplay: false,
        autoplayTimeout: 5000,
        loop: true,
        nav: false,
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            810: {
                items: 3
            }
        }
    });

    //------- Best Seller Carousel -------//
    if ($('.owl-carousel').length > 0) {
        $('#bestSellerCarousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            navText: ["<i class='ti-arrow-left'></i>", "<i class='ti-arrow-right'></i>"],
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                900: {
                    items: 3
                },
                1130: {
                    items: 4
                }
            }
        })
    }

    //------- single product area carousel -------//
    $(".s_Product_carousel").owlCarousel({
        items: 1,
        autoplay: false,
        autoplayTimeout: 5000,
        loop: true,
        nav: false,
        dots: false
    });

    //------- mailchimp --------//  
    function mailChimp() {
        $('#mc_embed_signup').find('form').ajaxChimp();
    }
    mailChimp();

    //------- fixed navbar --------//  
    $(window).scroll(function() {
        var sticky = $('.header_area'),
            scroll = $(window).scrollTop();

        if (scroll >= 100) sticky.addClass('fixed');
        else sticky.removeClass('fixed');
    });

    //------- Price Range slider -------//
    if (document.getElementById("price-range")) {

        var nonLinearSlider = document.getElementById('price-range');

        noUiSlider.create(nonLinearSlider, {
            connect: true,
            behaviour: 'tap',
            start: [500, 4000],
            range: {
                // Starting at 500, step the value by 500,
                // until 4000 is reached. From there, step by 1000.
                'min': [0],
                '10%': [500, 500],
                '50%': [4000, 1000],
                'max': [10000]
            }
        });


        var nodes = [
            document.getElementById('lower-value'), // 0
            document.getElementById('upper-value') // 1
        ];

        // Display the slider value and how far the handle moved
        // from the left edge of the slider.
        nonLinearSlider.noUiSlider.on('update', function(values, handle, unencoded, isTap, positions) {
            nodes[handle].innerHTML = values[handle];
        });

    }

});

$("#nav li a").click(function() {
    $(this).parent().addClass('active').siblings().removeClass('active');

});

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

var params = getSearchParameters();

var paging = document.getElementById("paging")
for (i = 0; i < paging.length; i++) {
    var page = paging.getElementsByTagName("li")[i];
    var currentPage = params.page
    console.log("js" + currentPage)
    if (i == currentPage) {
        page.setAttribute("class", "active");
    } else {
        page.setAttribute("class", "");
    }
}