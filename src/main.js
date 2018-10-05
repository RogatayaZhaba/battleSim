window.onload = windowReady;
function windowReady(){
	console.log("loaded fine");

	const startButton = document.querySelector(".start-button");
	const optionsNodes = {
		usurpers: {
			corvettes: document.querySelector("#usurpers-option-container .ships-option[data-shipClass='corvette']"),
			destroyers: document.querySelector("#usurpers-option-container .ships-option[data-shipClass='destroyer']"),
			cruisers: document.querySelector("#usurpers-option-container .ships-option[data-shipClass='cruiser']"),
			battleships: document.querySelector("#usurpers-option-container .ships-option[data-shipClass='battleship']"),
			titans: document.querySelector("#usurpers-option-container .ships-option[data-shipClass='titan']")
		},
		triumvirate: {
			corvettes: document.querySelector("#triumvirate-option-container .ships-option[data-shipClass='corvette']"),
			destroyers: document.querySelector("#triumvirate-option-container .ships-option[data-shipClass='destroyer']"),
			cruisers: document.querySelector("#triumvirate-option-container .ships-option[data-shipClass='cruiser']"),
			battleships: document.querySelector("#triumvirate-option-container .ships-option[data-shipClass='battleship']"),
			titans: document.querySelector("#triumvirate-option-container .ships-option[data-shipClass='titan']")
		}
	};
	const inputs = document.querySelectorAll(".ship-input input");
	let options = updateInputs(optionsNodes);
	console.log(inputs);

	inputs.forEach(input => {
		input.addEventListener("input", () => {
			options = updateInputs(optionsNodes);
			console.log(options);
		});
	});
	startButton.addEventListener("click", () => {
		showLoader(options);
	});
}
function updateInputs({usurpers: {
	corvettes:u_corvettes, 
	destroyers:u_destroyers, 
	cruisers:u_cruisers, 
	battleships:u_battleships, 
	titans:u_titans}, triumvirate: {
	corvettes:t_corvettes, 
	destroyers:t_destroyers, 
	cruisers:t_cruisers, 
	battleships:t_battleships, 
	titans:t_titans}}){

	
	
	return {
		usurpers: {
			corvettes: +u_corvettes.querySelector("input").value,
			destroyers: +u_destroyers.querySelector("input").value,
			cruisers: +u_cruisers.querySelector("input").value,
			battleships: +u_battleships.querySelector("input").value,
			titans: +u_titans.querySelector("input").value
		},
		triumvirate: {
			corvettes: +t_corvettes.querySelector("input").value,
			destroyers: +t_destroyers.querySelector("input").value,
			cruisers: +t_cruisers.querySelector("input").value,
			battleships: +t_battleships.querySelector("input").value,
			titans: +t_titans.querySelector("input").value
		}
	};
}
async function showLoader(options){
	const optionsPage = document.querySelector("#start-config");
	const loaderPage = document.querySelector("#battle-results");
	const loader = document.querySelector(".loader");
	const info = document.querySelector(".results-info");
	const result = resolveBattle(options);
	const winnerNode = document.querySelector(".winner");
	const uResultNode = document.querySelector(".usurpers-result");
	const tResultNode = document.querySelector(".triumvirate-result");

	winnerNode.innerText = result.winner;
	uResultNode.innerText = result.usurpersResult;
	tResultNode.innerText = result.triumvirateResult;

	optionsPage.classList.toggle("hidden");
	loaderPage.classList.toggle("hidden");

	await showAnimation(49500);
	loader.classList.toggle("hidden");
	info.classList.toggle("hidden");
}
function showAnimation(time){
	return new Promise(resolve => {
		let timerIDs = setLoaderPhrases();
		let id = setTimeout(() => {
			[...timerIDs, id].forEach(id => clearTimeout(id));
			resolve();
		}, time);
	});
}
function setLoaderPhrases(){
	const text = document.querySelector(".loading-text");
	const phrases = [
		"Поднимаем всех по тревоге...",
		"Раздаём пинки младшим офицерам",
		"Делаем предварительный пиф-паф",
		"Жёсткое рубилово флотилий",
		"Жёсткое рубилово продолжается",
		"Небольшая передышка",
		"...",
		"Возобновляем рубилово",
		"Расходимся",
		"Считаем потери",
		"Раздаём пинки младшим офицерам"
	];
	let timerIDs = [];

	phrases.forEach((phrase, index) => {
		let id = setTimeout(() => {
			text.innerText = phrase;
		}, 4500 * index);
		timerIDs.push(id);
	});
	return timerIDs;
}
function resolveBattle(options){
	const result = {
		winner: "",
		triumvirateResult: "",
		usurpersResult: ""
	};
	const uForce = calculateForce(options.usurpers);
	const tForce = calculateForce(options.triumvirate);
	const rnd = Math.random() * 0.2 - 0.1;
	const diff = uForce + uForce * rnd - tForce;
	let uLosses = {
		corvettes: 0,
		destroyers: 0,
		cruisers: 0,
		battleships: 0,
		titans: 0
	};
	let tLosses = {
		corvettes: 0,
		destroyers: 0,
		cruisers: 0,
		battleships: 0,
		titans: 0
	};
	let tLossesText = "";
	let uLossesText = "";
	
	if(diff > 0){
		result.winner = "Узурпаторы выиграли сражение!";
		uLosses = calculateLosses(options.usurpers, true, tForce/uForce);
		tLosses = calculateLosses(options.triumvirate, false, uForce/tForce);
	}
	else if(diff === 0){
		let rand = Math.random();
		if(rand > 0.5){
			result.winner = "Узурпаторы выиграли сражение!";
			uLosses = calculateLosses(options.usurpers, true, tForce/uForce);
			tLosses = calculateLosses(options.triumvirate, false, uForce/tForce);
		}
		else{
			result.winner = "Триумвират выиграл сражение!";
			uLosses = calculateLosses(options.usurpers, false, tForce/uForce);
			tLosses = calculateLosses(options.triumvirate, true, uForce/tForce);
		}
	}
	else{
		result.winner = "Триумвират выиграл сражение!";
		uLosses = calculateLosses(options.usurpers, false, tForce/uForce);
		tLosses = calculateLosses(options.triumvirate, true, uForce/tForce);
	}

	
	if(tLosses.corvettes > 0){
		tLossesText += `${tLosses.corvettes} корветов`;
	}
	if(tLosses.destroyers > 0){
		if(tLossesText.length > 0) tLossesText += ", ";
		tLossesText += `${tLosses.destroyers} эсминцев`;
	}
	if(tLosses.cruisers > 0){
		if(tLossesText.length > 0) tLossesText += ", ";
		tLossesText += `${tLosses.cruisers} крейсеров`;
	}
	if(tLosses.battleships > 0){
		if(tLossesText.length > 0) tLossesText += ", ";
		tLossesText += `${tLosses.battleships} линкоров`;
	}
	if(tLosses.titans > 0){
		if(tLossesText.length > 0) tLossesText += " and ";
		tLossesText += `${tLosses.titans} дрэдноутов`;
	}

	if(uLosses.corvettes > 0){
		uLossesText += `${uLosses.corvettes} корветов`;
	}
	if(uLosses.destroyers > 0){
		if(uLossesText.length > 0) uLossesText += ", ";
		uLossesText += `${uLosses.destroyers} эсминцев`;
	}
	if(uLosses.cruisers > 0){
		if(uLossesText.length > 0) uLossesText += ", ";
		uLossesText += `${uLosses.cruisers} крейсеров`;
	}
	if(uLosses.battleships > 0){
		if(uLossesText.length > 0) uLossesText += ", ";
		uLossesText += `${uLosses.battleships} линкоров`;
	}
	if(uLosses.titans > 0){
		if(uLossesText.length > 0) uLossesText += " and ";
		uLossesText += `${uLosses.titans} дрэдноутов`;
	}

	if(tLossesText.length > 0){
		result.triumvirateResult = `Триумвират потерял: ${tLossesText}`;
	}
	if(uLossesText.length > 0){
		result.usurpersResult = `Узурпаторы потеряли: ${uLossesText}`;
	}
	console.log(result);

	return result;
}
function calculateForce(side){
	return side.corvettes * 60 +
		side.destroyers * 160 +
		side.cruisers * 360 +
		side.battleships * 720 +
		side.titans * 5400;
}
function calculateLosses(side, isWinner, damage){
	const losses = {
		corvettes: 0,
		destroyers: 0,
		cruisers: 0,
		battleships: 0,
		titans: 0
	};
	const COEF = 0.5;
	const MAX_LOSSES = 0.85;
	const EVALUATED_COEF = damage * COEF;
	
	losses.corvettes = side.corvettes * EVALUATED_COEF > side.corvettes ?
		Math.round(side.corvettes * MAX_LOSSES):
		Math.round(side.corvettes * EVALUATED_COEF);
	losses.destroyers = side.destroyers * EVALUATED_COEF > side.destroyers ?
		Math.round(side.destroyers * MAX_LOSSES):
		Math.round(side.destroyers * EVALUATED_COEF);
	losses.cruisers = side.cruisers * EVALUATED_COEF > side.cruisers ?
		Math.round(side.cruisers * MAX_LOSSES):
		Math.round(side.cruisers * EVALUATED_COEF);
	losses.battleships = side.battleships * EVALUATED_COEF > side.battleships ?
		Math.round(side.battleships * MAX_LOSSES):
		Math.round(side.battleships * EVALUATED_COEF);
	losses.titans = side.titans * EVALUATED_COEF > side.titans ?
		Math.round(side.titans * MAX_LOSSES):
		Math.round(side.titans * EVALUATED_COEF);
	return losses;
}