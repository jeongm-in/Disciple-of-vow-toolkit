// based on elbisbe's Riven's gaze firebase script 
// https://github.com/elbisbe/rivengaze

init();
var allButtons = new Map();
let originalButtonPositions = new Map();

function init() {
    updateLabel();
    const keyInput = document.querySelector('#sessionInput');
    //this simply sends the "enterSession" function when enter is pressed, listening on the sessionInput box
    keyInput.addEventListener("keyup", (event) => {
        if (event.which === 13) { //on "enter"
            enterSession(keyInput.value);
        }
    })
    
    //This listener checks to see if the "hide session id" is clicked, and then updates it as needed
    document.getElementById("hideSessionIdSwitch").addEventListener("click", (event) => {
		let sessionIdLabel = document.getElementById("sessionIdValue");
		if(event.target.checked){
			sessionIdLabel.style.display = "none";
		} else {
			sessionIdLabel.style.display = "block";	
		}			
	})

}

//on keyup, this function is called, but why? what does it do?
function enterSession(key) {
    document.getElementById("sessionInput").style.display = "none";
    document.getElementById("sessionLabel").style.display = "none";
    document.getElementsByClassName("resetButton")[0].style.display = "block";

    let exists = 0;
		
	//This call checks to see if the "key" exists inside the database
    let dbexists = app.database().ref().child(key).child("exists");

	//and then updates "exists" as needed
    dbexists.on('value', snap => exists = snap.val());

    let uConnected = 0;
    setTimeout(() => {
        if (exists != 1) {
            firebase.database().ref().child(key).set({
                //call to add settings to the db
                'antarctica': "inactive",
                'earth': "inactive",
                'face': "inactive",
                'fleet': "inactive",
                'flower': "inactive",
                'forsaken': "inactive",
                'res': "inactive",
                'garden': "inactive",
                'snek': "inactive",
                'wellspring': "inactive",
                'ww': "inactive",
                'witness': "inactive",
                'tower': "inactive",
                'buttonsPressed': 0,
                'exists': 1,
                'uConnected': 0,
                'timestamp': Date.now()
            });
            //print that a new session was created
            document.getElementById('sessionIdValue').innerText = "Session ID: " + key + " (A new session has been created)";
        }
        else {
            document.getElementById('sessionIdValue').innerText = "Session ID: " + key;
        }
        //the "Session ID: could possibly be moved to outside this if: case, and then simply addes the 'a new session'        		

		let idConnected = document.querySelector("#uConnected");
        let dbConnected = firebase.database().ref().child(key).child('uConnected');
        dbConnected.on('value', snap => idConnected.innerText = snap.val());
        dbConnected.on('value', snap => uConnected = snap.val());

        uConnected++;
        let o_temp = {};
        let k_temp = 'uConnected';
        o_temp[k_temp] = uConnected;
        firebase.database().ref().child(key).update(o_temp);

        let dbGlobal = firebase.database().ref().child(key);
        let resetButton = document.querySelector(".resetButton");
        resetButton.addEventListener("click", () => {		

            o_temp = { buttonsPressed: 0 };
            firebase.database().ref().child(key).update(o_temp);

            dbGlobal.set({
                'antarctica': "inactive",
                'earth': "inactive",
                'face': "inactive",
                'fleet': "inactive",
                'flower': "inactive",
                'forsaken': "inactive",
                'res': "inactive",
                'garden': "inactive",
                'snek': "inactive",
                'wellspring': "inactive",
                'ww': "inactive",
                'witness': "inactive",
                'tower': "inactive",
                'buttonsPressed': 0,
                'exists': 1,
                'uConnected': uConnected,
                'timestamp': Date.now()
            });
		
            //The issue #5 may also be occuring here. Some questions to ask include
            //"is this lambda actually being triggered?" and "Does the .ref() actually invoke an update?"
            //Why would this be invoked in the "onKeyEnter" function?
            window.onbeforeunload = () => {
                uConnected--;
                o_temp = { 'uConnected': uConnected };
						

                firebase.database().ref().child(key).update(o_temp);
            }
        });
    }, 2000);

    createWatchers(key);

}

function createWatchers(key) {
    let a_float = document.querySelectorAll(".symbol");
    let resetButton = document.querySelector(".resetButton");

    let buttonsPressed = 0;		

    let dbPressed = firebase.database().ref().child(key).child('buttonsPressed');
			
    dbPressed.on('value', snap => buttonsPressed = snap.val());
		
    let dbGlobal = firebase.database().ref().child(key);
    let dbBtn = new Array(13);

    dbBtn[0] = dbGlobal.child('antarctica');
    dbBtn[1] = dbGlobal.child('earth');
    dbBtn[2] = dbGlobal.child('face');
    dbBtn[3] = dbGlobal.child('fleet');
    dbBtn[4] = dbGlobal.child('flower');
    dbBtn[5] = dbGlobal.child('forsaken');
    dbBtn[6] = dbGlobal.child('res');
    dbBtn[7] = dbGlobal.child('garden');
    dbBtn[8] = dbGlobal.child('snek');
    dbBtn[9] = dbGlobal.child('wellspring');
    dbBtn[10] = dbGlobal.child('ww');
    dbBtn[11] = dbGlobal.child('witness');
    dbBtn[12] = dbGlobal.child('tower');

    dbBtn[0].on('value', snap => updateButton(snap, 0));
	dbBtn[1].on('value', snap => updateButton(snap, 1));
	dbBtn[2].on('value', snap => updateButton(snap, 2));
	dbBtn[3].on('value', snap => updateButton(snap, 3));
	dbBtn[4].on('value', snap => updateButton(snap, 4));
	dbBtn[5].on('value', snap => updateButton(snap, 5));
	dbBtn[6].on('value', snap => updateButton(snap, 6));
	dbBtn[7].on('value', snap => updateButton(snap, 7));
	dbBtn[8].on('value', snap => updateButton(snap, 8));
	dbBtn[9].on('value', snap => updateButton(snap, 9));
	dbBtn[10].on('value', snap => updateButton(snap, 10));
	dbBtn[11].on('value', snap => updateButton(snap, 11));
	dbBtn[12].on('value', snap => updateButton(snap, 12));

    Array.from(document.getElementsByClassName("symbol")).forEach(
        s => {
            s.addEventListener("click", (event) => {
                let o_temp = {};
                const tag = event.target.dataset.for
                let k_temp = tag;
				
                const box = document.getElementById(tag);
		
				if(allButtons.get(tag) == "inactive"){				
                    if (buttonsPressed < 3) {
						o_temp[k_temp] = "active";
                    }
                    buttonsPressed++;
                } else if(allButtons.get(tag) == "active"){				
					o_temp[k_temp] = "inactive";
                    buttonsPressed--;
                }
						
				k_temp = buttonsPressed;
                o_temp["buttonsPressed"] = buttonsPressed;
				
                dbGlobal.update(o_temp);
				
            });
        }
    );

    let ref = firebase.database().ref();

    let now = Date.now();
    let cutoff = now - 2 * 60 * 60 * 1000; // remove db after 2 hours
    let old = ref.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
    old.on('child_added', function (snapshot) {
        snapshot.ref.remove();
    });

}

function updateButton(incoming, index){
	allButtons.set(incoming.key, incoming.val());
	var color = "beige";
	let a_float = document.querySelectorAll(".symbol");
	if(incoming.val() == "active"){
		color = "#E66100";
	} 
	a_float[index].style.backgroundColor = color;

}

function initLocalDataset(){
	var index = 0;
	Array.from(document.getElementsByClassName("symbol")).forEach(
        s => {
			allButtons.set(s,  "inactive");
			originalButtonPositions.set(s, index);
			index++;
		}
    );

}

/*Not used
*/
function sortButtons(){
	let htmlNodeList = document.getElementsByClassName("symbol");
	let nodeList = allButtons;
	console.log(nodeList);
  [].slice.call(htmlNodeList).sort( function(a,b){ 
		
		//console.log(allButtons.getValue(a));
		 var aFare = allButtons.get(a);
		 if (aFare === "active"){
			 console.log(a);
			 console.log("moving it up");
			a.parentNode.insertBefore( a, a.parentElement.firstChild);
		 } else {
			 //a.parentNode.insert(originalSymbolOrder.indexOf(a));
		 }
		 return 0;
   });

}

/*Not used
*/
function resetButtonPositions(){
	console.log("reset called");
	var symbolArray = Array.prototype.slice.call(document.getElementsByClassName("symbol"), 0);
	symbolArray.sort(function(a,b) {
		var aCat = originalButtonPositions.get(a);
		var bCat = originalButtonPositions.get(b);
		console.log(aCat);
		if (aCat > bCat) return 1;
		if (aCat < bCat) return -1;
		return 0;
	});

}

function getColor(button) {
    return button.style.backgroundColor;
    
}

function updateLabel() {
    let selector = document.querySelector(".calloutSelect")
    selector.addEventListener("change", () => {
				
        let selectedOption = selector.options[selector.selectedIndex].value;
        const calloutList = calloutData[selectedOption];

        calloutList.forEach(element => {
            const key = element.key
            const value = element.value
            document.getElementById(key).innerText = value;

        });
    });

}
