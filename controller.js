var budgetController = ( function (){
    //constructor function
   var expense = function(id , description , value){
       this.id = id ;
       this.description = description ;
       this.value = value ;
   };
    var income = function(id,description,value){
       this.id = id ;
       this.description = description ;
       this.value = value ;
   };
    var calculateTotal = function(type){
        var sum = 0 ;
        //for each method accepts a call back function
        data.allItems[type].forEach(function(current){
            sum+=current.value ;
            data.total[type] = sum ;
        });
    };
    // one big data structure - object
    var data = {
        //methods
        allItems:{
        exp : [] ,
        inc : []
                },
        //methods
        total :{
            exp : 0 ,
            inc : 0
               },
        budget : 0 ,
        percentage : -1
    };

    //create a public method that allows other modules to add item ot our budgetcontroller
    //which item to add during call - inc or exp
    return {
        addItem : function(type , des , val){
            var newItem , ID;

            //create a new id
            if ( data.allItems[type].length > 0){
             ID = data.allItems[type][data.allItems[type].length - 1].id + 1 ;}
            else
                {ID = 0 ; }
            //create new item
            if (type === "exp")
                newItem = new expense(ID , des , val) ;
            else if ( type === "inc")
                newItem = new income(ID, des ,val );

            // push into data structure
            data.allItems[type].push(newItem) ;
            //retrieve it in data structure
            return newItem ;
        },
        deleteItem : function(type , id){

          //  1. return an array
          var ids , Index;
          ids = data.allItems[type].map(function(current){
            return current.id ;
          });

          // 2. index
          Index  = ids.indexof(id) ;

          //3. remove that very element
          if(Index !== -1)
          {
            data.allItems[type].splice(index , 1);
          } 
        },




        calculateBudget : function (){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget total income and expenses
            data.budget = data.total.inc -  data.total.exp ;
            // calculate the percentage income
            if ( data.total.inc > 0){
            data.percentage = Math.round((data.total.exp / data.total.inc )*100);
             }
            else {
                data.percentage = -1 ;
            }
            },
        getBudget : function(){
            return {
            budget : data.budget ,
            totalInc : data.total.inc ,
            totalExp : data.total.exp ,
            totalPercent : data.percentage
            }
        },

        testing:function(){
            console.log(data);
        }
    };
})() ;














var UIContorller = ( function (){
    //object
     var  DOMstrings = {
        inputType : '.add__type' ,
        inputDescription : '.add__description' ,
        inputValue : '.add__value' ,
        inputButton : '.add__btn' ,
        incomeContainer : '.income__list' ,
        expensesContainer : '.expenses__list' ,
        budgetLabel : '.budget__value' ,
        incomeLabel : '.budget__income--value' ,
        expenseLabel : '.budget__expenses--value' ,
        percentageLabel : '.budget__expenses--percentage' ,
        container : '.container'
    };

    return {
        // object method returning
        getInput : function () {
            return  {
                // always return object
                type : document.querySelector(DOMstrings.inputType).value ,
                description : document.querySelector(DOMstrings.inputDescription).value ,
                // first prob - string to integer
                value : parseInt(document.querySelector(DOMstrings.inputValue).value  )
                    };
                } ,
        addlistItem : function(obj , type){
            var html , newHtml ,element;
            //add html string with placeholder text
            if( type === 'inc')
            {
                element = DOMstrings.incomeContainer ;
                html = '<div class = "item clearfix" id="inc-%id%"><div class ="item__description">%description%</div><div class ="right clearfix"><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div><div class = "item__value">%value%</div></div></div>' ;
            }
            else if ( type === 'exp')
            {
                element = DOMstrings.expensesContainer ;
                html = '<div class = "item clearfix" id ="exp-%id%"><div class = "item__description">%description%</div><div class = "right clearfix" ><div class = "item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div><div class = "item__value">%value%</div><div class = "item__percentage">21%</div></div></div>' ;
            }
            //replace the placeholder text with actula data
            newHtml = html.replace('%id%', obj.id ) ;
            newHtml = newHtml.replace('%description%' , obj.description) ;
            newHtml = newHtml.replace('%value%' , obj.value) ;
            //insert html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);
        },
        clearFields : function(){
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue) ;
            var fieldsArray = Array.prototype.slice.call(fields) ;
            // an array of two elements
            fieldsArray.forEach(function(current , index , array){
               current.value = "" ;
            });
            fieldsArray[0].focus() ;
        } ,

        displayBudget : function(obj){
          document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget ;
          document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc ;
          document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

          if(obj.totalPercent>0)
          document.querySelector(DOMstrings.percentageLabel).textContent = obj.totalPercent + " %";
          else
          document.querySelector(DOMstrings.percentageLabel).textContent = "- ";

        },


        getDOMstrings : function(){
            return DOMstrings ;
        }
    };
})() ;












var controller  = ( function ( budgetCtrl , UICtrl){
    //function that setup event listner
    var setupEventListner = function(){
        var DOM = UICtrl.getDOMstrings() ;
        document.querySelector(DOM.inputButton).addEventListener('click' , ctrlAddItem) ;
        document.addEventListener('keypress' , function(event){
        if(event.keyCode === 13 || event.which === 13)
        ctrlAddItem()  ;
    });
      document.querySelector(DOM.container).addEventListener('click' ,ctrlDeleteItem)
    };


   var updateBudget = function(){

       //  1. Calculate the budget
       budgetCtrl.calculateBudget() ;
       //  2. Return the budget
       var budget = budgetCtrl.getBudget() ;
        //  3. Display the budget on the UI
       UICtrl.displayBudget(budget);

   };

    var ctrlAddItem = function (){

        var input , NewItem ;
        //  1. get the field input data
         input = UICtrl.getInput() ;

        if(input.description !=="" && !isNaN(input.value) && input.value > 0 ){

            //  2. Add the item to budget controller - obj
             NewItem = budgetCtrl.addItem(input.type , input.description , input.value) ;

            //  3. Add the item to UI
            var newUIItem = UICtrl.addlistItem(NewItem , input.type) ;

            // 4. clear the fields
            var clearfields = UICtrl.clearFields() ;

            // calculate and update budget
            updateBudget();
        }
        else
            alert("Please fill the entire fields") ;
    };

    var ctrlDeleteItem = function(event){
      var itemID , type , ID ;
      itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);
      if(itemID){
        var splitID = itemID.split('-');
        type = splitID[0] ;
        ID = splitID[1] ;

        //1. delete the item from the data structure

        //2. delete the item form the UI

        //3.Update and show the new budget

      }
    };

    return {
        init : function (){

            console.log("Applications has started");
            UICtrl.displayBudget({
                budget : 0,
                totalInc : 0 ,
                totalExp : 0 ,
                totalPercent : 0
                }) ;
                  setupEventListner() ;
        }
    };
})(budgetController , UIContorller) ;



// responsible for application running ;
controller.init() ;
