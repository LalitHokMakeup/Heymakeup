let btn_backToTop = $("#btn_backToTop");
$(window).scroll(function () {
  if ($(window).scrollTop() > 150) {
    btn_backToTop.addClass("show");
  } else {
    btn_backToTop.removeClass("show");
  }
});
btn_backToTop.on("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$(".add-to-bag-btn button").on("click",async function () {
  var productId = $(this).attr('data-product_id');
  var productQuantity = $(this).data("product_quantity");
  $(this).text('Adding To Bag...');
  await reUseCart("/cart/add.js", productId, productQuantity);
  $('#mainCartContainer').load(location.href + " #mainCartContainer");
  $(this).text('Add To Bag');
  initializecartdrawer();
});
function isProductPage() {
  return window.location.pathname.includes('/products/');
}
const lazyLoadBackgrounds = document.querySelectorAll(".lazy-load-background");

  lazyLoadBackgrounds.forEach(function (element) {
    const dataSrc = element.getAttribute("data-src");
    if (dataSrc) {
      element.style.backgroundImage = `url(${dataSrc})`;
      element.removeAttribute("data-src");
    }
  });

// Put your application javascript here
const reUseCart = async (method, varId, qty) => {
   
  await axios
    .post(method, {
      id: varId,
      quantity: qty ? qty : 1,
    })
    .then((res) => {
      $("#toastifies").show(50);
      setTimeout(() => {
        $("#toastifies").hide(50);
      }, 3000);
      //let totalcartItems = parseInt($(".cart_item_count").text());
      // $(".cart_item_count,.mini_cart_item_count").text(
      //   `${res.data.item_count ? res.data.item_count : totalcartItems + 1}`
      // );
      //return toastr.success("Cart Updated", "SuccessFully");
    })
    .catch((error) => {
      alert("Not Done");
      // return toastr.warning(`${error}`, "Some Error Occured");
    });
};

$(".close_overlay").on("click", function () {
  $(".quick-view-slide-container").removeClass("quick-view-slide-open");
  $(".quickview-overlay").removeClass("quickview-overlay-open");
  $('.account-auth-container').removeClass('toggle-account-container');
  $('.overlay-container').removeClass('overlay-open');
});
var feedbackSlider; // Declare feedbackSlider in a higher scope
let quickTogglebtnId;
let quicksecnId 
function initializeQuickViewSlider() {
  $('div[data-quickviewslide="open"]').on("click", function () {
     
    quickTogglebtnId = $(this).attr("data-quickviewID");
    quicksecnId = $(this).attr("data-sectionID");
    let sliders = `#image_Slider${quickTogglebtnId}${quicksecnId}`;
    $(`#Quickview${quickTogglebtnId}${quicksecnId}`).addClass("quick-view-slide-open");
    $(".quickview-overlay").addClass("quickview-overlay-open");
     $(`#Quickview${quickTogglebtnId}${quicksecnId}`).find(".swatch_available:first").attr('checked','true');
    feedbackSlider = tns({
      container: sliders,
      items: 2,
      gutter: 8,
      slideBy: 1,
      loop: false,
      controlsPosition: "bottom",
      navPosition: "bottom",
      mouseDrag: true,
      nav: true,
      navItems: 4,
      preventScrollOnTouch: "auto",
      controls: true,
      autoplay: false,
      autoplayButtonOutput: false,
      controlsContainer: `#slides${quickTogglebtnId}${quicksecnId}`,
      responsive: {
        0: {
          nav: false,
        },
        768: {
          items: 2,
        },
      },
    });
  });

  $('.swatch_param :radio').change(function () {
    let $this = $(this);
    let optionValue = $this.val();
    let imagePosition = Number($this.attr('imagePosition'));
    let variantName = $this.attr('variantid');
    let varientPrice = parseInt($this.attr('varientPrice'));
    let rackPrice = parseInt($this.attr('rackPrice'));
    let discountedPercentage = Math.round(((rackPrice - varientPrice) / rackPrice) * 100);
    let $container = isProductPage() ? $this.closest('.product-details-container') : $this.closest('.quick-view-main-container');
    let $shadeSpan = $container.find(isProductPage() ? '.current-shade span' : '.quick-view-current-shade span');
    let $addToBagBtn = $container.find(isProductPage() ? '.add-to-bag-btn' : '.add-quick-bag-btn');
    let $priceContainer = $container.find(isProductPage() ? '.product-prices' : '.quick-view-price');
    if (isProductPage()) {
      vertical_slider.goTo(imagePosition - 1);
      mainSlider.goTo(imagePosition - 1);
      $shadeSpan.text(variantName);
      $addToBagBtn.attr('data-product_id', optionValue);
      $priceContainer.find('.selling-price').text(`Rs. ${varientPrice}`);

      if (rackPrice > varientPrice) {
          $priceContainer.find('.old-price').text(`Rs. ${rackPrice}`);
          $priceContainer.find('.discount').text(`${discountedPercentage}% Off`);
          $priceContainer.find('.old-price, .discount').show();
      } else {
          $priceContainer.find('.old-price, .discount').hide();
      }
  } else {
      $(`#image_Slider${quickTogglebtnId}${quicksecnId}`).fadeOut(100, function () {
          feedbackSlider.goTo(imagePosition - 1);
          $(`#image_Slider${quickTogglebtnId}${quicksecnId}`).fadeIn(100);
      });
      $shadeSpan.text(variantName);
      $addToBagBtn.attr('data-product_id', optionValue);
      $priceContainer.find('.selling-price').text(`Rs. ${varientPrice}`);

      if (rackPrice > varientPrice) {
          $priceContainer.find('.old-price').text(`Rs. ${rackPrice}`);
          $priceContainer.find('.discount').text(`${discountedPercentage}% Off`);
          $priceContainer.find('.old-price, .discount').show();
      } else {
          $priceContainer.find('.old-price, .discount').hide();
      }
  }
  });
}

initializeQuickViewSlider();
initializecartdrawer();

$(".quick-view-shade input").each((index, shade) => {
  $(shade).on("change", function () {
    $(".quick-view-slider").slick(
      "slickGoTo",
      $(this).attr("data-imageposition")
    );
  });
});

$(".quick-view-current-shade span").text(
  $(".quick-view-shade input:checked").val()
);
$(".quick-view-shade input").each((index, shade) => {
  $(shade).on("change", (e) => {
    $(".quick-view-current-shade span").text(e.target.value);
  });
});

$(".quick-view-shade input").each((index, shade) => {
  $(shade).on("change", function () {
    if ($(this).attr("data-inventory") > 0) {
      $(".add-to-bag-btn").removeClass("d-none");
      $(".notify-me-btn").addClass("d-none");
    } else {
      $(".notify-me-btn").removeClass("d-none");
      $(".add-to-bag-btn").addClass("d-none");
    }
  });
});

// $('.quick-view-shade').each((index, shade) => {
// 
//   $(shade).attr('data-inventory') > 0 ? $(shade).find('div').attr('data-instock','true') : $(shade).find('div').attr('data-instock','false');
// })
// account-auth-code =================================================================================
$('.account-btn').on('click', () => {
  if(window.matchMedia("(max-width: 992px)").matches){
    $('.account-auth-container').toggleClass('toggle-account-container');
    $('.overlay-container').addClass('overlay-open');
  }
  //$('.quickview-overlay').toggleClass('quickview-overlay-open');
});
// $('.account-auth-login-btn').on('click',()=>{
//   $('.account-auth-container').removeClass('toggle-account-container');
//   //$('.sign-up-container, .overlay-container').addClass('sign-up-container-open overlay-open');
//   $('.sign-up-container').addClass('sign-up-container-open');
//   $('.overlay-container ').addClass('overlay-open');

// })
// $('.sign-in-with-mobile-btn').on('click',()=>{
//   // $('.account-auth-container').removeClass('toggle-account-container');
//   $('.sign-up-container').removeClass('sign-up-container-open');
//   //$('.sign-up-form-container, .overlay-container').addClass('sign-up-form-container-open overlay-open');

//   $('.sign-up-form-container').addClass('sign-up-form-container-open');
//   $('.overlay-container ').addClass('overlay-open');
// })
const closeAuth =()=>{
   $('.account-auth-container, .overlay-container, .sign-up-container, .sign-up-form-container').removeClass('toggle-account-container overlay-open sign-up-container-open sign-up-form-container-open');

  // $('.account-auth-container').removeClass('toggle-account-container');
  // $('.overlay-container ').removeClass('overlay-open');
  // $('.sign-up-container').removeClass('sign-up-container-open');
  // $('.sign-up-form-container').removeClass('sign-up-form-container-open');
}
$('.overlay-container, .auth-close-btn, .sign-up-container-close-btn, .sign-up-form-close-btn').on('click', () => {
  closeAuth();
});

