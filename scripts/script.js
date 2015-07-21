console.log("works!")


$(document).ready(function(){


// making 8 boxex and 8 small boxes inside.
var Game = function(){
	this.render = function(){
		for (var i = 0; i < 9; i++){
			var $div = $("<div>").attr('class', 'box').attr('id', i);
			$(".frame").append($div);

			var $inBox = $("<div>").attr('class', 'inBox');
			$($div).append($inBox);

		}
	}
}



// construct a game object
var game = new Game();
game.render();


//connection with server

var socket = io.connect();

var $chat = $('#chat');
var $nickForm = $("#nickName");
var $nickError = $('h3');
var $inBox = $('.inBox');
var userName, nickNames, userOne, userTwo, userObjOne, userObjTwo, images


	//stat by clicking 
	$("#start").click(function(){
		$("#start").off("click");
		// change button to mode
		$(".radial").removeAttr('id', 'start').attr('id','mode').html("MODE");

		// image drawing
		function imgDraw (){
			images = ['dog1.gif', 'cat1.gif', 'dog2.gif', 'cat2.gif', 'dog3.gif', 'cat3.jpg', 'dog4.gif', 'cat4.gif','dog5.gif'];
		
			$.each(images, function(idx, val){
				$('.inBox').eq(idx).css('background-image', 'url(' + './styles/'+ images[idx] +')');
				$inBox.addClass('animated flipInX')
			})
		};
		imgDraw(); 	
	
		//mode select modal
		$("#mode").click(function(){
			$("#mode").off("click");
			$("#modal").slideToggle();
			$(".outmost, .row, .outter, .frame, .radial").hide();

		});


		//hide modal when the user select a mode
		$("#fbutton").click(function(e){
			e.preventDefault();

			socket.emit('new user', $nickForm.val(),function(data){
				if(data){
					$("#modal").slideUp();
					var timeout = setTimeout(function(){
					$(".outmost, .row, .outter, .frame, .radial").show();
					},500)
			
					//change the button to play again
					$(".radial").removeAttr('id', 'mode').attr('id','again').html("AGAIN");
					// $("#fbutton").off("click");


				}else{
					$nickError.html('That username is already taken !');
				}
				$nickForm.val('');
				
			});
			//end socket.emit
		});	
		//end click event

		socket.on('username', function(data){

			userName = data; 

		});

		socket.on('usernames', function(data){
			nickNames = data;

			// assign O and X
			if(nickNames.length === 3) {
				userOne = nickNames[1];
				userTwo = nickNames[2];
				userObjOne = {name: userOne, flag: "O"};
				userObjTwo = {name: userTwo, flag: "X"};

			// put the info in DOM
			$('.left').html(userObjOne.name  + " : O");
			$('.right').html(userTwo  + " : X");
			}
		});

		$('.inBox').click(function(e){
				e.preventDefault();
				socket.emit('send position', $('.inBox').index(this));
		});


    socket.on('new position', function(data){

			if (data.nick === userOne && !endGameFlag){
				$('.inBox').eq(data.idx).css('background-image', 'url('+ img[0]+')');
				$inBox.eq(data.idx).attr('id', 'O');
				$inBox.addClass('animated flipInX')
				
			}else{
				$('.inBox').eq(data.idx).css('background-image', 'url('+ img[1]+')');
				$inBox.eq(data.idx).attr('id', 'X');
				$inBox.addClass('animated flipInX')

			}

			if(decision(data.idx)){
				imgDraw();
				endGameFlag = true;
				if(userName === userObjOne.name){
					//winning message
					winning('O');
				}else{
					winning('X');
				}
			}else{
				var ids = [];
				for (i=0; i<9; i++){
					if($inBox.eq(i).attr('id') != undefined){
						ids.push($inBox.eq(i).attr('id'));	
					}
				}
				if (ids.length === 9){
						imgDraw();
						tie();
						endGameFlag = true;
					}
			}

  
    });
    // winning message
    function winning(arg){
    	debugger;
    	if(arg === 'O') {
    		$inBox.eq(1).css('background-image', 'url('+ img[0]+')');
			}else{
				$inBox.eq(1).css('background-image', 'url('+ img[1]+')');
			}
			$inBox.eq(3).css('background-image', 'url('+ img[2]+')');
  		$inBox.eq(4).css('background-image', 'url('+ img[3]+')');
  		$inBox.eq(5).css('background-image', 'url('+ img[4]+')');
  		$inBox.eq(7).css('background-image', 'url()');
  		$inBox.eq(7).css('background-image', 'url('+ img[5]+')');
  		
    }

   	// tie message
   	function tie(){
   		$inBox.eq(3).css('background-image', 'url('+ img[6]+')');
   		$inBox.eq(4).css('background-image', 'url('+ img[7]+')');
   		$inBox.eq(5).css('background-image', 'url('+ img[8]+')');
   		$inBox.eq(7).css('background-image', 'url('+ img[5]+')');
   		$inBox.addClass('animated flipInX')
   	}



		
		// // // Game object 
		// var TicTacToe = function(){

			// variables
			var board, endGameFlag, user, com, userImg, comImg, winningLines, i, img, innerFlag
			img = ['./styles/o.png','./styles/x.png', './styles/w.png', './styles/won.png', './styles/n.png', './styles/ex.png', './styles/t.png', './styles/i.png', './styles/e.png']; 

			winningLines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8],[2,4,6]];

			// functions 
			function drawBoard () {
				board = [];
			}

			function reset() {
				$inBox.removeAttr('id');
				endGameFlag = false;
				// $.each(board, function(idx, val){
				// 	$(".box").eq(idx).html(val);
				// });
				user = '';
				com = '';

			}


			function decision(arg){
				innerFlag = false;
				debugger;
				for (i=0; i<winningLines.length; i++){
					var n = winningLines[i]
					if ( ($inBox.eq(n[0]).attr('id') != undefined) && ($inBox.eq(n[0]).attr('id') === $inBox.eq(n[1]).attr('id')) && ($inBox.eq(n[0]).attr('id') != undefined) && ($inBox.eq(n[0]).attr('id') === $inBox.eq(n[2]).attr('id'))){
						innerFlag = true;
					}
				}

			return innerFlag;
				
			}

			//replay
			//change the button to play again
			// $(".radial").removeAttr('id', 'mode').attr('id','again').html("AGAIN");
			// $("#fbutton").off("click");

			$('#again').click(function(){
				alert("asdsfsdf")
			})




	});
	//#start click end

});



























