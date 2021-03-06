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

function removeTeamCallback (){
	window.location.reload();
}

/*
 *	serialize a form into JSON (ref. serializeObject())
 */
function toJson (htmlData) {
	var data = $(htmlData).serializeObject();
	/*
	 *	remove empty player fields from JSON data.
	 */
	var l = 0;
	if(data.players) {
		if(data.players instanceof Array) {
			l = (data.players).length;
			for(var i  = 0; i < l; i++) {
				if(data.players[i] == "") (data.players).pop(i);
			}
		} else { //	convert players field into array!
			tmp = data.players;
			data.players = [];
			(data.players).push(tmp);
		}
	}
	//	Deleting msg_box field from JSON data
	delete data.msgBox;
	$("form").submit(function(e) {
		e.preventDefault();
	});
	sendToServer(JSON.stringify(data));
}

/*
 *	convert JSON into HTML form elements
 */
function toHtml (jsonData, i) {
	var o = jsonData[i]
		, team_id = o["_id"]
		, team_name = o.team_name
		, captain = o.captain
		, players = []
		, players_l = 0
		, email = o.email
		, mobNum = o.mobNum;

		addTeam(team_id, team_name, captain, email, mobNum);

		var teamX = document.getElementById(team_id)
			, f = teamX.getElementsByTagName("form")
			, g = f[0]
			, p = (g.getElementsByClassName("players"))[0];

		if (o.players) {
			if (o.players instanceof Array) {
			players_l = (o.players).length;
				for (var j = 0; j < players_l; j++) {
					players.push(o.players[j]);
					addPlayer(p, teamX, players[j]);
				};
			};
		};
}

var getFromServer = function  () {
	$("form").submit(function(e) {
		e.preventDefault();
	});
	$.ajax({
        type : 'GET',
        accepts : 'json',
        dataType : 'json',
        url : '/get',
        contentType : 'application/json; charset=UTF-8',
        error: function(jqxhr, status, err) {
        		//console.log(JSON.stringify(err) + " " + JSON.stringify(status)
        		//	+ " " + JSON.stringify(jqxhr));
        	},
        success : function(data, status) {
            for (var i = 0; i < data.length; i++) {
            	toHtml(data, i);
            };
            return data;
        }
    });
} ();

function sendToServer (arg) {
    $.ajax({
        type : 'POST',
        accepts : 'json',
        dataType : 'json',
        url : '/post',
        contentType : 'application/json; charset=UTF-8',
        data: arg,
        error: function(jqxhr, status, err) {
        			//console.log(JSON.stringify(err) + " " + JSON.stringify(status)
        			//	+ " " + JSON.stringify(jqxhr));
        		},
        success: function(data, status, jqxhr) {
        			//console.log(JSON.stringify(data) + " " + JSON.stringify(status)
        			//	+ " " + JSON.stringify(jqxhr));
        		}
    });
}

function addTeam (team_id, team_name, captain, email, mobNum) {

	team_id = defaultFor(team_id, "team_" + Math.floor((Math.random()*100)+1));
	team_name = defaultFor(team_name, "");
	captain = defaultFor(captain, "");
	email = defaultFor(email, "");
	mobNum = defaultFor(mobNum, "");

	$("#teams").append(
		  "<div id='" + team_id + "' class='team'>"
		+ "<form onsubmit='return false;'>"
	 	+ "<input type='text' class='team_name' "
	 	+ "name='team_name' placeholder='Team name' value='" + team_name + "'>"
	 	+ "<br>"
	 	+ "<div class='captain_title'>Captain</div>"
		+ "<input type='text' class='captain' name='captain' placeholder='Captain' "
		+ "value='" + captain + "'>"
		+ "<div class='players'></div>"
		+ "<br>"
		+ "<input type='text' class='msgBox'"
		+ " name='msgBox' value='Team incomplete!' readonly>"
		+ "<br>"
		+ "<input type='email' class='msgBox' name='email' placeholder='@' "
		+ "value='" + email + "'>"
		+ "<br>"
		+ "<input type='text' class='msgBox' name='mobNum' placeholder='Mobile Number' "
		+ "value='" + mobNum + "'>"
		+ "<br>"
		+ "<button class='addPlayer' onclick='addPlayer(this, " + team_id + ")'>Add Player</button>"
		+ "<br><br>"
		+ "<button class='addPlayer' onclick='"
		+ "removeTeam(" + team_id + ", " + removeTeamCallback + ");'>Remove Team</button>"
		+ "<input type='hidden' name='_id' value='" + team_id + "'>"
		+ "</form></div>");
	var teamX = document.getElementById(team_id)
		, t = teamX.getElementsByTagName("form")
		, y = t[0];

	$(t).submit(function(e) {
		e.preventDefault();
	});
	y.onchange = function(){toJson(y)};
}

function removeTeam (team_id, callback) {
	team_id = '{ "_id" : "' + team_id.getAttribute('id') + '" }';
	$.ajax({
        type : 'POST',
        accepts: 'json',
        dataType : 'json',
        url : '/removeTeam',
        contentType : 'application/json; charset=UTF-8',
        data: team_id,
        error: function(jqxhr, status, err) {
        			//console.log(JSON.stringify(err) + " " + JSON.stringify(status)
        			//	+ " " + JSON.stringify(jqxhr));
        		},
        success: function(data, status, jqxhr) {
        			//console.log(JSON.stringify(data) + " " + JSON.stringify(status)
        			//	+ " " + JSON.stringify(jqxhr));
        			callback();
        		}
    });
}

function addPlayer (arg, team, player_name) {
	player_name = defaultFor(player_name, "");
	arg = arg.parentNode.children;
	var players = arg[4],
		msg_box = arg[5],
		newline = document.createElement("br"),
		player = document.createElement("input"),
		minus = (document.createElement("button"));

	player.setAttribute("value", player_name);
	player.setAttribute("placeholder", "New player");
	player.setAttribute("class", "player");
	player.setAttribute("name", "players");
	minus.onclick = function() { 
		removePlayer(this, team);
		$("form").submit(function(e) {
			e.preventDefault();
		});
	};
	minus.setAttribute("class", "removePlayer");
	minus.appendChild(document.createTextNode("-"));

	var n = players.getElementsByTagName("input").length + 2;

	if (n < 6) {
			players.appendChild(player);
			players.appendChild(minus);
			players.appendChild(newline);
	} 

	var teamX = team.getElementsByTagName("form")
		, y = teamX[0];
	y.onchange = function(){
		toJson(y);
		$("form").submit(function(e) {
			e.preventDefault();
		});
	};
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

	$("form").submit(function(e) {
		e.preventDefault();
	});

	var n = players.getElementsByTagName("input").length + 1;
	updateMsg(players, n);
}

/*
 *	Update message field
 */
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

function defaultFor(arg, val) { 
	return typeof arg !== 'undefined' ? arg : val; 
}