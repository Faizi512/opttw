import 'parsleyjs/dist/parsley.min.js';


class Common {
  constructor() {
    var CI = this;
    // this.formValidation = {}
    this.validate();
    // this.currentTab = 0;
    // this.details = {};
    // this.fillform()
  }

  getFormDetails(form){
    var data = $(form)[0].dataset.details
    this.details = JSON.parse(data)
  }

  popupTerms(){
    $( ".close" ).click(function() {
      $('.modal').hide();
    });
  }


  validate(){
    this.formValidation = $('#msform').parsley({
      trigger: "focusout",
      errorClass: 'error',
      successClass: 'valid',
      errorsWrapper: '<div class="parsley-error-list"></div>',
      errorTemplate: '<label class="error"></label>',
      errorsContainer (field) {
        if(field.$element.hasClass('approve')){
          return $('.error-checkbox')
        }
        if(field.$element.hasClass('owner-period')){
          return $('.owner-error-box')
        }
        if(field.$element.hasClass('error-on-button')){
          return $(field.element.closest(".step").querySelector(".error-box"))
        }
        return field.$element.parent()
      },
    })
    // this.validateEmail()
    // this.validateApiPostcode()
    this.validatePhone()
  }

  validateEmail(){
    var CI = this
    window.Parsley.addValidator('validemail', {
      validateString: function(value){
        var xhr = $.ajax('https://go.webformsubmit.com/dukeleads/restapi/v1.2/validate/email?key=50f64816a3eda24ab9ecf6c265cae858&value='+$('.email').val())
        return xhr.then(function(json) {
          if (json.status == "Valid") {
            CI.isEmail = true
            return true
          }else if(json.status == "Invalid"){
            return $.Deferred().reject("Please Enter Valid Email Address");
          }else{
            CI.isEmail = true
            return true
          }
        }).catch(function(e) {
          if (e == "Please Enter Valid Email Address") {
            return $.Deferred().reject("Please Enter Valid Email Address")
          }else{
            CI.isEmail = true
            return true
          }
        });
      },
      messages: {
         en: 'Please Enter Valid Email Address',
      }
    });
  }

  validatePhone(){
    var CI = this
    window.Parsley.addValidator('validphone', {
      validateString: function(value){
        var xhr = $.ajax('https://go.webformsubmit.com/dukeleads/restapi/v1.2/validate/mobile?key=50f64816a3eda24ab9ecf6c265cae858&value='+$('.phone').val())
        return xhr.then(function(json) {
          var skipresponse = ["EC_ABSENT_SUBSCRIBER", "EC_ABSENT_SUBSCRIBER_SM", "EC_CALL_BARRED", "EC_SYSTEM_FAILURE","EC_SM_DF_memoryCapacityExceeded", "EC_NO_RESPONSE", "EC_NNR_noTranslationForThisSpecificAddress", "EC_NNR_MTPfailure", "EC_NNR_networkCongestion"]
          if (skipresponse.includes(json.response) && json.status == "Valid" ) {
            CI.isPhone = true
            $(".global-phone-success").addClass("d-inline-block")
            return true
          }
          else if (json.status == "Valid") {
            $(".global-phone-success").addClass("d-inline-block")
            CI.isPhone = true
            return true
          }else if(json.status == "Invalid"){
            $(".global-phone-success").removeClass("d-inline-block")
            return $.Deferred().reject(`Please Enter Valid Phone Number`);
          }else if(json.status == "Error"){
            return $.Deferred().reject(`Please Enter Valid Phone Number`);
          }else{
            CI.isPhone = true
            return true
          }
        }).catch(function(e) {
          if (e == `Please Enter Valid Phone Number`) {
            return $.Deferred().reject(`Please Enter Valid Phone Number`)
          }else{
            CI.isPhone = true
            $(".global-phone-success").addClass("d-inline-block")
            return true
          }
        });
      },
      messages: {
         en: `Please Enter Valid Phone Number` ,
      }
    });
  }

  validateApiPostcode(){
    var CI = this;
    window.Parsley.addValidator('validapipostcode', {
      validateString: function(value){
        return $.ajax({
          url:`https://api.getAddress.io/find/${$(".postcode").val()}?api-key=NjGHtzEyk0eZ1VfXCKpWIw25787&expand=true`,
          success: function(json){
            $(".property-div").show()
            if (json.addresses.length > 0) {
              var result = json.addresses
              var adresses = []
               adresses.push( `
                <option
                disabled=""
                selected=""
                >
                Select Your Property
                </option>
              `)
              for (var i = 0; i < result.length; i++) {
                adresses.push( `
                    <option
                    data-street="${result[i].line_1 || result[i].thoroughfare}"
                    data-city="${result[i].town_or_city}"
                    data-address="${result[i].formatted_address.toString().replaceAll(',', ' ')}"
                    data-province="${result[i].county || result[i].town_or_city}"
                    data-street2="${result[i].line_2}"
                    data-building="${result[i].building_number || result[i].sub_building_number || result[i].building_name || result[i].sub_building_name}"
                    >
                    ${result[i].formatted_address.join(" ").replace(/\s+/g,' ')}
                    </option>
                  `)
                }
                $('#property').html(adresses)
                $(".address-div").remove();
              return true
            }else{
              $(".step").removeClass("in-progress")
              return $.Deferred().reject("Please Enter Valid Postcode");
            }
          },
          error: function(request){
            console.log(request.statusText)
            request.abort();
            if (request.statusText == "timeout") {
              $(".property-div").remove();
            }
          },
          timeout: 5000
        })
      },
      messages: {
         en: 'Please Enter Valid Postcode',
      }
    });
  }

  fixStepIndicator(num) {
    var progress = document.getElementById('progressBar');
    if(num > 0) {
      progress.style.width = ((num+1) *25)+"%";
      $('.progress-percent').text(((num+1)*25) + "%" + " Complete");
      $('.progress-steps').text("Step " + (num + 1) + "/4");
    }
    if( num ==  0){
      $('.progress-steps').text("Step  1/4");
      progress.style.width = (25)+"%";
      $('.progress-percent').text("25% Complete");
    }
  }

  fillform(){
    $(".first_name").val(this.getUrlParameter("firstname") || "");
    $(".last_name").val(this.getUrlParameter("lastname")  || "");
    $(".postcode").val(this.getUrlParameter("postcode")  || "");
    $(".email").val(this.getUrlParameter("email")  || "");
    $(".phone").val(this.getUrlParameter("phone1") || this.getUrlParameter("mobile") || "");
  }


  showCircle(){
    $(".step").addClass("in-progress")
  }

  getData() {
    return {
      debt_amount: $("input[name='debt-amount']:checked").val() || this.getUrlParameter('debt_amount') || "",
      number_of_creditors: $("input[name='debt-numbr']:checked").val() || this.getUrlParameter('number_of_creditors') || "",
      residentialStatus: $( "#residential-status option:selected" ).val() || this.getUrlParameter('residentialStatus') || "",
      employmentStatus: $( "#employment-status option:selected" ).val() || this.getUrlParameter('employmentStatus') || "",
      sid: this.getUrlParameter('sid') || 1,
      ssid: this.getUrlParameter('ssid') || 1,
      source: this.getUrlParameter('source') || '',
      optindate: this.getFormattedCurrentDate(),
      optinurl: 'https://debtclear.today' + window.location.pathname,
      firstname: this.getUrlParameter('firstname') || $(".first_name").val() ||  '',
      lastname: this.getUrlParameter('lastname') || $(".last_name").val() ||  '',
      email: this.getUrlParameter('email') || $(".email").val() ||  '',
      phone1: this.getUrlParameter('phone1') || $(".phone").val() ||  '',
      ipaddress: this.details.ipaddress,
      street1: this.getUrlParameter('street1') || $(".street1").val() || $(".address").val() || 'unknown',
      street2: this.getUrlParameter('street2') || $(".street2").val() || '',
      building: this.getUrlParameter('houseNumber') || $(".houseNumber").val() || "",
      towncity: this.getUrlParameter('towncity') || $(".towncity").val() || 'unknown',
      postcode: this.getUrlParameter('postcode') || $(".postcode").val() || '',
      county: this.getUrlParameter('county') || $(".county").val() || '',
      campaign_name: this.details.camp_id,
      keyword: this.getUrlParameter('keyword') || '',
      gclid: this.getUrlParameter('gclid') || "",
      adgroupid: this.getUrlParameter('adgroupid') || '',
    };
  }

  firePixel(){
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({'event': 'transaction'})
  }

   postData() {
    var CI = this;
    var data = this.getData();
    this.submitLead(data, this.details.camp_id)
  }

  submitLead(formData, campid){
    var CI = this
    $.ajax({
      type: "POST",
      url: "https://go.webformsubmit.com/dukeleads/waitsubmit?key=eecf9b6b61edd9e66ca0f7735dfa033a&campid=" + campid,
      data: formData,
      success: function(data) {
        window.location = "/success"
      },
      dataType: "json"
    })
    CI.firePixel();
  }

  getFormattedCurrentDate() {
    var date = new Date();
    var day = this.addZero(date.getDate());
    var monthIndex = this.addZero(date.getMonth() + 1);
    var year = date.getFullYear();
    var min = this.addZero(date.getMinutes());
    var hr = this.addZero(date.getHours());
    var ss = this.addZero(date.getSeconds());

    return day + '/' + monthIndex + '/' + year + ' ' + hr + ':' + min + ':' + ss;
  }

  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  getSourceFromURL(){
    return this.getUrlParameter('source') || '';
  }

  getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  }
}

export default Common;
