$(document).ready(function(){
    var overallProfits = {};
    var userValue = 0;
    var profit = 0.0;
    var stop = false;
    var reset = false;
    var incrementProfit = 0;
    var incrementStoch = 0;
    var incrementUser = 0;
    var savedStochValues = {};
    var getStoch = 0;
    var useFunc = "1 - (userValue - stochValue)^2";
    var changeFunc = false;
    var once = true;
    var stochValue = 0;
    var regulateReset = 0;
    var wrongValue = document.getElementById('badValue');
    
    //to see if chart should be moved
    function moveDOMElements(){
        if($(window).width() < 890){
            $('.profitChart').css('top', '850px');
            $('.profitChart').css('left', '0px');
            
            $('#ProfitNum').css('position', 'absolute');
            $('#OverallProfits').css('position', 'absolute');
            $('#badValue').css('position', 'absolute');
            $('#addValue').css('position', 'absolute');
            
            $('#ProfitNum').css('top', '1200px');
            $('#OverallProfits').css('top', '1250px');
            $('#badValue').css('top', '1200px');
            $('#addValue').css('top', '1250px');
        }
        else if(screen.width < 890){
            $('.profitChart').css('top', '950px');
            $('.profitChart').css('left', '0px');
            
            $('#ProfitNum').css('position', 'absolute');
            $('#OverallProfits').css('position', 'absolute');
            $('#badValue').css('position', 'absolute');
            $('#addValue').css('position', 'absolute');
            
            $('#ProfitNum').css('top', '1300px');
            $('#OverallProfits').css('top', '1350px');
            $('#ChFunc').css('top', '475px');
            $('#restFunc').css('top', '500px');
            $('#badValue').css('top', '1200px');
            $('#addValue').css('top', '1250px');
        }
        wrongValue.innerHTML = "";
        $('#addValue').css('visibility', 'hidden');
    }
    moveDOMElements();
    
    //To change the stochastic variable
    //Javascript Closure Idea from w3schools.com
    var stochastic = (function () {
        return function () {
            if(stop == false && reset == false){
                var newTime = new Date();
                var time = newTime.getTime();
                stochValue = Math.random();
                stochValue %= time;
            }
            //reset might run through already saved stochastic values from before
            else if(reset == true && stop == false && getStoch < savedStochValues.length
                         && getStoch == regulateReset) {
                stochValue = savedStochValues[getStoch];
                ++getStoch;
            }
            if(reset == false) getStoch = 0;
            return stochValue;
        }
    })();
    
    stochValue = stochastic();
    stochValue = setInterval(stochastic, 1000);//set cycles through loop when reset happens 
    
    //To change the profit function
    var newFunction = (function () {
        return function () {
            var givenFunc = document.getElementById('NewFunc').value;
            var equalIndex = givenFunc.search("=");
            useFunc = givenFunc.substr(equalIndex+1).trim();
            if(useFunc.indexOf("(") == 0) useFunc = useFunc.substr(1);
            if(useFunc.lastIndexOf(")") == useFunc.length-1) 
                useFunc = useFunc.substr(0,useFunc.length-1);
            return useFunc;
        }
    })();
    
    //The main function to run
    function init(){
        moveDOMElements();
        
        if(stochValue > 1 || stochValue < 0 || reset == true) stochastic();
        
    	if(reset == true) ++regulateReset;
    	else regulateReset = 0;
    	
        if(stop == true && once == true && reset == false) {
            --incrementStoch;
            stochValue = savedStochValues[incrementStoch];
            once = false;
        }
        
        if(changeFunc == true) newFunction();
        calculate(userValue, stochValue, useFunc);
        
        if(profit != "Failed"){
            overallProfits[incrementProfit] = profit;
            ++incrementProfit;
        }
        
        if(reset == false && stop == false){
            savedStochValues[incrementStoch] = stochValue;
            ++incrementStoch;
            savedStochValues.length = incrementStoch;
        }
        
        if(profit != "Failed"){
            //Output the results
            var giveProfit = document.getElementById('ProfitNum');
            
            if(profit < 1 && profit >0){
                giveProfit.innerHTML = ('Profit = ' + profit);
            
                var storeProfit = document.getElementById('OverallProfits');
                storeProfit.innerHTML += ('<li class=\'list-group-item\'>' + profit + '</li>');
            }
            else {
                wrongValue.innerHTML = 'Value is not in the expected range.'
                                        + '<br>Do you Still Wish to Use this Value?';
                
                giveProfit.innerHTML = ('Profit = ' + profit);
                
                $('#ProfitNum').css('top', '1300px');
                $('#OverallProfits').css('top', '1350px');
                $('#addValue').css('visibility', 'visible');
            }
        }
        else{
            var giveProfit = document.getElementById('ProfitNum');
            giveProfit.innerHTML = ('Function has Failed to Compute Within the Proper Range');
        }
         
        var giveStochVal = document.getElementById('StochVal');
        giveStochVal.innerHTML = ('Stochastic Value = ' + stochValue);
        
        numPoints();
        userData.push([timeInt(incrementUser),userValue]);
        stochData.push([timeInt(incrementUser),stochValue]);
        profitData.push([timeInt(incrementUser),profit]);
        ++incrementUser;
        
        changeFunc = false;
    }
    
    //For calucalting the 
    function power(powNew, powValue){
        //powNew value to power
        //powValue number of times to power
        powNew = powNew.trim();
        if(powValue == 1) return powNew;
        if(powValue == 0) return "1";
        var origPow = powNew;
        for(var i = 1;i < parseInt(powValue);++i){
           var valueCalulate = powNew + " * " + origPow;
           powNew = eval(valueCalulate) + "";
        }
        return powNew;
    }
    
    //do the calculations for the values
    function calculate(userValue, stochValue, useFunc){
        var powSy = {};
        var i = 0;
        var indexStart = 0;
        powSy.length = 0;
        while(indexStart < useFunc.length){
            if(useFunc.indexOf('^', indexStart) != -1){
                powSy[i] = useFunc.indexOf('^', indexStart);
                indexStart = powSy[i] + 1;
                ++i;
                powSy.length = i;
            }
            else break;
        }
        var rightParan = " ";
        var powExp = "";
        var predoPow = 0;
        var valuesCalculated = {};
        var leftParan, powNew = -1;
        var extraValues = useFunc.substr(0,powSy[0]).trim();
        for(var doPow = 0; doPow < powSy.length; ++doPow){
            var endOfPow = useFunc.indexOf(" ", powSy[doPow]) - powSy[doPow];
            if(endOfPow < 0) endOfPow = useFunc.length - (powSy[doPow]+1);
            
            var powValue = useFunc.substr(powSy[doPow]+1, endOfPow);
            
            if(doPow == 0) powExp = useFunc.substr(predoPow,powSy[doPow]).trim();
            else powExp = useFunc.substr(predoPow, powSy[doPow]).trim();
            
            rightParan = powExp.lastIndexOf(")");
            //where pow is for a single value
            if(rightParan == -1) {
                powNew = powExp.lastIndexOf(" ")+1;
                var numberOfChars = useFunc.length - (powSy[doPow]+1);
                var valueToCompute = powExp.substr(powNew, numberOfChars);
                }
            else { //where values inside pow must be computed first
                leftParan = powExp.lastIndexOf("(");
                var valueToCompute = powExp.substr(leftParan, rightParan-1);
                valueToCompute = eval(valueToCompute) + "";
            }
            
            var powCal = power(valueToCompute, powValue) + "";
            if(doPow != 0) powExp = powExp.substr(0, 1) + powCal + "";
            else powExp = powCal + "";
            valuesCalculated[doPow] = powExp;
                
            if(doPow == powSy.length-1) {
                var getSym = extraValues.indexOf(" ", 2);
                valuesCalculated[doPow+1] = extraValues.substr(0,getSym);
            }
                
            //determine where to start the next point
            var dontGetPow = useFunc.indexOf(" ", powSy[doPow]);
            predoPow = dontGetPow;
            valuesCalculated.length = doPow+1;
        }
            
        if(powSy.length == 0) profit = eval(useFunc);
        else{
            var finalVal = valuesCalculated[valuesCalculated.length];
            for(var elem = 0; elem < valuesCalculated.length; elem++){
                finalVal = finalVal + valuesCalculated[elem];
            }
            profit = eval(finalVal);
        }
            
        if(isNaN(profit)) { ////profit > 1 || profit < 0 || 
            profit = "Failed";
        }
    }
    
    //Get user value
    $("#Enter").on("click", function (event) {
        var textbox = $("#keywordBox").val();
        if(parseFloat(textbox) < 1 && parseFloat(textbox) > 0){
            userValue = parseFloat(textbox);
            init(useFunc);
        }
    })
    
    //Stop the random function from running
    $("#Stop").on("click", function (event) {
        //get previous stochValue
        stop = true;
    })
    
    $("#Start").on("click", function (event) {
        //start creating the stochValue
        stop = false;
        reset = false;
        once = true;
    })
    
    //reset by getting previous values
    $("#Reset").on("click", function (event) {
        stop = false;
        reset = true;
    })
    
    //Show and Hide the Sochastic Value
    var count = 0;
    $("#Show").on("click", function (event) {
        $("#StochVal").css("visibility", "visible");
        count += 1;
        if($("#StochVal").css("visibility", "visible") && count == 2){
            $("#StochVal").css("visibility", "hidden");
            count=0;
        }
    })
    
    //Change the function that the user uses
    $("#ChFunc").on("click", function (event) {
        //Get values and seperate them from textarea object NewFunc
        changeFunc = true;
    })
    
    //Change the function back to original
    $("#restFunc").on("click", function (event) {
        //Get values and seperate them from textarea object NewFunc
        document.getElementById('NewFunc').value = 'Profit = (1 - (userValue - stochValue)^2)';
        changeFunc = true;
    })
    
    //Add the value that users wants
    $("#addValue").on("click", function (event) {
        var storeProfit = document.getElementById('OverallProfits');
                storeProfit.innerHTML += ('<li class=\'list-group-item\'>' + profit + '</li>');
        moveDOMElements();
    })
});
