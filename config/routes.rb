Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root "pages#opt_out"

  post "/submit_data", to: "pages#submit_data"
end
