import Common from "./common.js"

class Home extends Common {
  constructor() {
    super();
    var CI = this;
    // this.getFormDetails('#msform');
    // this.validate("#msform")
    // this.fixStepIndicator(0)
    //jQuery time
    this.current_fs 
    this.next_fs
    this.previous_fs; //fieldsets
    this.left 
    this.opacity 
    this.scale; //fieldset properties which we will animate
    this.animating; //flag to prevent quick multi-click glitches


    $( ".property" ).change(function() {
      $('.towncity').val($(this).find("option:selected").data("city"))
      $('.street1').val($(this).find("option:selected").data("street"))
      $('.county').val($(this).find("option:selected").data("province"))
      $('.houseNumber').val($(this).find("option:selected").data("housenum"))
      $('.street2').val($(this).find("option:selected").data("street2"))
      $('.building').val($(this).find("option:selected").data("building"))
    });

    $("#submit-btn").click(function(){
      $('#msform').parsley().whenValidate({
        group: 'block-4'
      }).done(() =>{
        $("#submit-btn").prop('disabled', 'disabled')
      })
    })

    $(".next").click(function(){
      var _this = this
      $('#msform').parsley().whenValidate({
        group: 'block-' + CI.currentTab
      }).done(() =>{
        var tabs = $("fieldset");
        CI.currentTab = CI.currentTab + 1;
        if(CI.animating) return false;
        CI.animating = true;
        var current_field = $(_this).data("current")
        var next_field = $(_this).data("next")

        CI.current_fs = $('.'+current_field)
        CI.next_fs = $('.'+next_field);
        
        if (CI.currentTab == 5) {
          if ($(".page").val() == 'sms') {
            $(".loader-div").removeClass("d-none")
            CI.postData()
          }
          else
          {
            if (CI.isPhone == true && CI.isEmail == true){
              $(".loader-div").removeClass("d-none")
              CI.postData()
            }else{
              $(".loader-div").addClass("d-none")
              $('#msform').parsley().validate()
            }
          }
          return true
        }
        else{
          //activate next step on progressbar using the index of this.next_fs
          CI.fixStepIndicator(CI.currentTab)
          //show the next fieldset
          CI.next_fs.show(); 
          //hide the current fieldset with style
          CI.current_fs.animate({opacity: 0}, {
            step: function(now, mx) {
              //as the opacity of this.current_fs reduces to 0 - stored in "now"
              //1. scale this.current_fs down to 80%
              this.scale = 1 - (1 - now) * 0.2;
              //2. bring this.next_fs from the right(50%)
              this.left = (now * 50)+"%";
              //3. increase opacity of this.next_fs to 1 as it moves in
              this.opacity = 1 - now;
              CI.current_fs.css({
                'transform': 'scale('+this.scale+')',
                'position': 'absolute'
              });
              CI.next_fs.css({'left': this.left, 'opacity': this.opacity});
            }, 
            duration: 800, 
            complete: function(){
              CI.next_fs.css({'position': 'relative'});
              CI.current_fs.hide();
              CI.animating = false;
            }, 
            //this comes from the custom easing plugin
            // easing: 'easeInOutBack'
          });
        }
      });
    });

    $(".previous").click(function(){
      $('html,body').animate({
        scrollTop: $("fieldset").offset().top},
        'fast');
      var _this = this
      if(CI.animating) return false;
      CI.animating = true;
      CI.currentTab = CI.currentTab - 1;
      var current_field = $(_this).data("current")
      var prev_field = $(_this).data("previous")
      CI.current_fs = $('.'+current_field);
      CI.previous_fs = $('.'+prev_field);
      
      //de-activate current step on progressbar
      CI.fixStepIndicator(CI.currentTab)
      
      //show the previous fieldset
      CI.previous_fs.show(); 
      //hide the current fieldset with style
      CI.current_fs.animate({opacity: 0}, {
        step: function(now, mx) {
          //as the opacity of this.current_fs reduces to 0 - stored in "now"
          //1. scale this.previous_fs from 80% to 100%
          this.scale = 0.8 + (1 - now) * 0.2;
          //2. take this.current_fs to the right(50%) - from 0%
          this.left = ((1-now) * 50)+"%";
          //3. increase opacity of this.previous_fs to 1 as it moves in
          this.opacity = 1 - now;
          CI.current_fs.css({'left': this.left, 'position': 'absolute'});
          CI.previous_fs.css({'transform': 'scale('+this.scale+')', 'opacity': this.opacity});
        }, 
        duration: 800, 
        complete: function(){
          CI.previous_fs.css({'position': 'relative'});
          CI.current_fs.hide();
          CI.animating = false;
        }, 
        //this comes from the custom easing plugin
        //easing: 'easeInOutBack'
      });
    });
  }

  fixStepIndicator(num) {
    var progress = document.getElementById('progressBar');
    if(num > 0) {
      progress.style.width = ((num) * 20)+"%";
      $('.progress-percent').text(((num) * 20) + "%" + " Complete");
    }
  }
}
export default new Home();
