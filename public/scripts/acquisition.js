// based on elbisbe's Riven's gaze firebase script 
// https://github.com/elbisbe/rivengaze

init();

function init() {

    updateLabel();
    const keyInput = document.querySelector('#sessionInput');
    keyInput.addEventListener("keyup", (event) => {
        if (event.which === 13) {
            enterSession(keyInput.value);
        }
    })
    document.getElementById("hideSessionIdSwitch").addEventListener("click", (event) => {
		let sessionIdLabel = document.getElementById("sessionIdValue");
		if(event.target.checked){
			sessionIdLabel.style.display = "none";
		} else {
			sessionIdLabel.style.display = "block";	
		}			
	})

}

function enterSession(key) {

    document.getElementById("sessionInput").style.display = "none";
    document.getElementById("sessionLabel").style.display = "none";
    document.getElementsByClassName("resetButton")[0].style.display = "block";


    let exists = 0;
    let dbexists = app.database().ref().child(key).child("exists");
    dbexists.on('value', snap => exists = snap.val());

    let uConnected = 0;
    setTimeout(() => {
        if (exists != 1) {
            firebase.database().ref().child(key).set({
                'antarctica': "beige",
                'earth': "beige",
                'face': "beige",
                'fleet': "beige",
                'flower': "beige",
                'forsaken': "beige",
                'res': "beige",
                'garden': "beige",
                'snek': "beige",
                'wellspring': "beige",
                'ww': "beige",
                'witness': "beige",
                'tower': "beige",
                'buttonsPressed': 0,
                'exists': 1,
                'uConnected': 0,
                'timestamp': Date.now()
            });
            document.getElementById('sessionIdValue').innerText = "Session ID: " + key + " (A new session has been created)";
        }
        else {
            document.getElementById('sessionIdValue').innerText = "Session ID: " + key;
        }

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
                'antarctica': "beige",
                'earth': "beige",
                'face': "beige",
                'fleet': "beige",
                'flower': "beige",
                'forsaken': "beige",
                'res': "beige",
                'garden': "beige",
                'snek': "beige",
                'wellspring': "beige",
                'ww': "beige",
                'witness': "beige",
                'tower': "beige",
                'buttonsPressed': 0,
                'exists': 1,
                'uConnected': uConnected,
                'timestamp': Date.now()
            });


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

    dbBtn[0].on('value', snap => a_float[0].style.backgroundColor = snap.val());
    dbBtn[1].on('value', snap => a_float[1].style.backgroundColor = snap.val());
    dbBtn[2].on('value', snap => a_float[2].style.backgroundColor = snap.val());
    dbBtn[3].on('value', snap => a_float[3].style.backgroundColor = snap.val());
    dbBtn[4].on('value', snap => a_float[4].style.backgroundColor = snap.val());
    dbBtn[5].on('value', snap => a_float[5].style.backgroundColor = snap.val());
    dbBtn[6].on('value', snap => a_float[6].style.backgroundColor = snap.val());
    dbBtn[7].on('value', snap => a_float[7].style.backgroundColor = snap.val());
    dbBtn[8].on('value', snap => a_float[8].style.backgroundColor = snap.val());
    dbBtn[9].on('value', snap => a_float[9].style.backgroundColor = snap.val());
    dbBtn[10].on('value', snap => a_float[10].style.backgroundColor = snap.val());
    dbBtn[11].on('value', snap => a_float[11].style.backgroundColor = snap.val());
    dbBtn[12].on('value', snap => a_float[12].style.backgroundColor = snap.val());


    Array.from(document.getElementsByClassName("symbol")).forEach(
        s => {
            s.addEventListener("click", (event) => {
                let o_temp = {};
                const tag = event.target.dataset.for
                let k_temp = tag;

                const box = document.getElementById(tag)

                if (getColor(box) == "beige") {
                    if (buttonsPressed < 3) {
                        o_temp[k_temp] = "#E66100"
                    }
                    buttonsPressed++;
                }
                k_temp = buttonsPressed;
                o_temp["buttonsPressed"] = buttonsPressed;
                dbGlobal.update(o_temp);
            });
        }
    )

    let ref = firebase.database().ref();
    let now = Date.now();
    let cutoff = now - 2 * 60 * 60 * 1000; // remove db after 2 hours
    let old = ref.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
    old.on('child_added', function (snapshot) {
        snapshot.ref.remove();
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
    })

}
