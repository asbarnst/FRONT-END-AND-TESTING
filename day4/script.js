let randomNumber = Math.floor(Math.random()*10)+1;
let attempts = 0;
function checkNumber(){
    let userGuess = document.getElementById("guess").value;
    let result = document.getElementById("result");
    attempts++;
    document.getElementById("count").innerHTML = attempts;
    if(userGuess == randomNumber){
        result.innerHTML = "🎉 Correct! You guessed it!";
    }
    else if(userGuess > randomNumber){
        result.innerHTML = "Too High ⬆️";
    }
    else{
        result.innerHTML = "Too Low ⬇️";
    }
}