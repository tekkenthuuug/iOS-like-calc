const numbers = document.querySelectorAll(".number");
const resultField = document.querySelectorAll(".result")[0];
const clear = document.querySelector("#clear");
const operations = document.querySelectorAll(".operation");
const equal = document.querySelector("#equal");
const percentage = document.querySelector("#percentage");
const changeSign = document.querySelector("#change-sign");

const state = {
	currentField : 0,
	savedField   : undefined,
	operationId  : undefined
};

const unlightOps = () => {
	operations.forEach((el) => {
		el.classList.remove("orange_selected");
	});
};

const renderField = () => {
	// Creating and adding spans with spaces
	console.log(state);
	resultField.innerText = "";
	let spaceCount = 0;
	const arrayField = String(state.currentField).split("");
	const comaIndex = arrayField.indexOf(".");
	if (arrayField.length > 9) {
		resultField.innerText = "ERR";
	} else {
		for (let i = arrayField.length; i > 0; i--) {
			let numSpan = document.createElement("span");
			numSpan.innerText = arrayField[i - 1] === "." ? "," : arrayField[i - 1];
			if (spaceCount + 1 === 4) {
				spaceCount = 0;
				// Adds spaces wheater we passed coma or coma is not presented
				if ((i < comaIndex || comaIndex === -1) && arrayField[i - 1] != "-") numSpan.classList.add("spanSep");
			}
			resultField.appendChild(numSpan);
			spaceCount++;
		}
	}
};

const comute = () => {
	if (state.savedField === undefined) state.savedField = state.currentField;
	switch (state.operationId) {
		/*
		0 - Division
		1 - Multiply
		2 - Substraction
		3 - Addition
		*/
		case 0:
			state.currentField = state.savedField / state.currentField;
			break;
		case 1:
			state.currentField *= state.savedField;
			break;
		case 2:
			state.currentField = state.savedField - state.currentField;
			break;
		case 3:
			state.currentField += state.savedField;
			break;
	}
	// Checks wheather number is int or not
	if (state.currentField % 1 !== 0) {
		console.log(String(state.currentField));
		state.currentField = state.currentField.toFixed(3);
	}
	renderField();
	state.savedField = undefined;
	document.querySelector(".info-box").style.animation = "notify 6s ease-in-out forwards";
};

const copyField = () => {
	const el = document.createElement("textarea");
	el.value = String(state.currentField);
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
};

numbers.forEach((el) => {
	el.addEventListener("click", () => {
		clear.innerText = "C";
		const dataNum = Number(el.getAttribute("data-num"));
		if (state.operationId != undefined && state.savedField === undefined) {
			unlightOps();
			state.savedField = state.currentField;
			state.currentField = dataNum;
		} else {
			if (state.currentField === 0) {
				state.currentField = dataNum;
			} else if (String(state.currentField).replace(/[-\s]/g, "").length < 9) {
				state.currentField = Number(String(state.currentField) + String(dataNum));
			} else {
				return;
			}
		}
		renderField();
	});
});

percentage.addEventListener("click", () => {
	state.currentField = (state.currentField / 100).toFixed(2);
	renderField();
});

changeSign.addEventListener("click", () => {
	state.currentField = -state.currentField;
	renderField();
});

resultField.addEventListener("click", (e) => {
	copyField();
	const copyNotification = document.createElement("div");
	copyNotification.innerHTML = "Copied";
	copyNotification.classList.add("copied");
	copyNotification.style.top = e.target.offsetTop - e.target.offsetHeight / 2 + "px";
	copyNotification.style.left = e.x - 30 + "px";
	resultField.append(copyNotification);
	setTimeout((e) => {
		document.querySelector(".copied").remove();
	}, 3000);
});

operations.forEach((el, index) => {
	el.addEventListener("click", () => {
		unlightOps();
		if (state.savedField != undefined && state.currentField != undefined) {
			comute();
		}
		state.operationId = index;
		el.classList.add("orange_selected");
	});
});

equal.addEventListener("click", () => {
	comute();
	unlightOps();
	state.operationId = undefined;
});

clear.addEventListener("click", () => {
	console.log(state);
	if (clear.innerText === "C") {
		clear.innerText = "AC";
		if (state.operationId != undefined) {
			operations[state.operationId].classList.add("orange_selected");
		}
	} else {
		state.savedField = undefined;
		state.operationId = undefined;
		resultField.innerText = "0";
	}
	state.currentField = 0;
	resultField.innerText = "0";
	console.log(state);
});
