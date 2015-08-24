# Vending Machine - by Caleb Briancesco

This test uses nodejs, express, mongodb, jade, stylus, jquery and javascript.



# Before installation

Make sure you have already installed nodejs and mongodb and that they’re working and running globally in your computer



# Instructions of installation

1-	Copy the github repository to any location in your computer
2-	In the terminal (for Mac users) go inside the project folder
3-	Install the dependencies by typing “npm install” in the terminal, that will be fast and easy
4-	Turn on mongodb typing “mongod” in the terminal
5-	Now lets create the database we’ll use in the app by typing in the terminal “mongo localhost:27017/vending data/vending_machine_products.js” now we have the database with 9 products and info to play with
6-	Now run gulp (type “gulp” in the terminal) to create the css file 
7-	Type “node app.js” and if you didn’t had any problems you should be able to go to http://localhost:4000/ and play with it



# Vending machine assumptions

1-	Machine should show the product name, price, quantity and image
2-	Machine should be able to accept any amount of money and give change to the user
3-	Machine should notify the user if there is not enough money to buy the product
4-	Machine should be able to cancel a transaction if the user doesn’t agree with the amount of the change
5-	If the amount of money is exactly the necessary for a product, the process will finish without asking the user if they agree seems there is not change 
6-	Products will be managed by the database 
7-	Price of products should have 2 decimals 
8-	Machine will not process other product unless the user takes the previous purchased product
9-	Machine should show on the screens the instructions to make the purchase 
10-	If the machine has the user’s money and the user wants a product not available, the change will be the same amount of money the user added
11-	Every time one product have been purchased the data will be updated in the database




# Functionalities not included because of lack of time

1-	Basic amount of money in the machine for the money changes: I could have added a variable that detects the amount of money added by the user vs the amount of money inside the machine and decide if the machine is able to send the user the change or if it is too much
2-	A functionality that manages the price of the products vs the price the machine sells them so we can get the profit of every product and a total of all the products selled
3-	A page where we could manage the products info, price, name, image and quantity in case  we would like to change or remove info, etc… 


# Notes

1- I know there may be some bugs (or many) but I actually could only work on this for a very short amount of time
2- There where no instructions at all... for real... not even one... so this could be very different of what you expected :)




Outside that... please enjoy it, let me know what you think.
Thanks

Caleb Briancesco
jcaleb4@hotmail.com



