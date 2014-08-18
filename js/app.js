$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function addTeam () {
	var team_id = 'team_'+ Math.floor((Math.random()*100)+1);
	$("#teams").append(
		  "<div id='" + team_id + "' class='team'>"
		+ "<form onsubmit='return false;'>"
	 	+ "<input type='text' class='team_name' name='team_name' placeholder='Team name'>"
	 	+ "<br>"
	 	+ "<div class='captain_title'>Captain</div>"
		+ "<input type='text' class='captain' name='captain' placeholder='Captain'>"
		+ "<div class='players'></div><br>"
		+ "<input type='text' class='msgBox'"
		+ " name='msgBox' value='Team incomplete' readonly><br>"
		+ "<button class='addPlayer' onclick='addPlayer(this, " + team_id + ")'>Add Player</button>"
		+ "<input type='hidden' name='team_id' value='" + team_id + "'>"
		+ "</form></div>");
	var teamX = document.getElementById(team_id);
	var t = teamX.getElementsByTagName("form");
	var y = t[0];
	y.onchange = function(){toJson(y)};
}


function addPlayer (arg, team) {
	arg = arg.parentNode.children;
	var players = arg[4],
		msg_box = arg[5],
		newline = document.createElement("br"),
		player = document.createElement("input"),
		minus = (document.createElement("button"));

	player.setAttribute("placeholder", "New player");
	player.setAttribute("class", "player");
	player.setAttribute("name", "players[]");
	minus.onclick = function() { removePlayer(this, team);};
	minus.setAttribute("class", "removePlayer");
	minus.appendChild(document.createTextNode("-"));

	var n = players.getElementsByTagName("input").length + 2;

	if (n < 6) {
			players.appendChild(player);
			players.appendChild(minus);
			players.appendChild(newline);
	} 

	var teamX = team.getElementsByTagName("form");
	var y = teamX[0];
	y.onchange = function(){toJson(y)};
	updateMsg(players, n);
}


function removePlayer (minus, team) {
	var teamX = team.getElementsByTagName("form")
	, form = teamX[0]
	, players = minus.parentNode;
	minus.previousSibling.remove();
	minus.nextSibling.remove();
	toJson(form);
	minus.remove();

	var n = players.getElementsByTagName("input").length + 1;
	updateMsg(players, n);
}


function updateMsg (players, n) {
	var msg_box = (players.nextSibling).nextSibling;
	if (n < 4) {
		msg_box.value = "Team incomplete!";
	}

	if (n > 3 && n < 5) {
		msg_box.value = "Sufficent players!";
	}

	if (n == 5) {
		msg_box.value = "Team full!";
	}
}


function sendToServer (arg) {
    $.ajax({
        type : 'POST',
        url : '/post',
        contentType : 'application/json; charset=UTF-8',
        data: arg,
        error: function(jqxhr, status, err) {
        			console.log(JSON.stringify(jqxhr) 
        			+ " " + JSON.stringify(err) 
        			+ " " + JSON.stringify(status));
        		}
    });
}


var getFromServer = function  () {
	$.ajax({
        type : 'GET',
        url : '/get',
        contentType : 'application/json; charset=UTF-8',
        error: function(jqxhr, status, err) {
        	console.log(JSON.stringify(jqxhr) 
        	+ " " +JSON.stringify(err) 
        	+ " " + JSON.stringify(status));},
        success : function(data, status) {
            console.log(JSON.stringify(data));
            return data;
        }
    });
} ();


function show () {
	var str = $("form").serialize();
	y = $("form").prop("tagName");
	var o = $("form").serializeObject();
	var x = document.body.children;
	x = x[0].children;
	x = x[0].children;
	var r = x[0];
	r = $(r).serializeObject();
	var s = JSON.stringify(r);
	$("#test").text(s);
}


function toJson (team) {
	var data = $(team).serializeObject();
	sendToServer(JSON.stringify(data));
	console.log("json: " + JSON.stringify(data));
}