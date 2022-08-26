class PagesController < ApplicationController
    def opt_out
    end

    def submit_data
        
        byebug

        url = URI.parse("http://dukeleads.leadbyte.co.uk/api/submit.php?returnjson=yes&campid=STOPUK&email=#{params[:email]}&phone1=#{params[:phone]}")
        req = Net::HTTP::Get.new(url.to_s)
        res = Net::HTTP.start(url.host, url.port) {|http|
            http.request(req)
        }
        puts res.body
        redirect_to "/thank_you"
    end

    def thank_you
    end
end
