const button = document.getElementById("btn");
const item = document.getElementById("item-caffeine");

// button.addEventListener("click", showSelectedOption);

button.addEventListener("click", () => {
	showSelectedOption();
	displayTotal();
});

window.onload = function () {
	populateDropdown();
};

const drinks = [
	{
		name: "Coffee",
		caffeinePerFlOz: 12,
		caffeinePerMl: 0.270512452,
		caffeinePerCup: 64.92296,
	},
	{
		name: "Espresso",
		caffeinePerFlOz: 63.6,
		caffeinePerMl: 0.033814057,
		caffeinePerCup: 8.11537,
	},
	{
		name: "Decaf Coffee",
		caffeinePerFlOz: 0.3,
		caffeinePerMl: 0.270512452,
		caffeinePerCup: 64.92296,
	},
	{
		name: "Instant Coffee",
		caffeinePerFlOz: 7.8,
		caffeinePerMl: 0.270512452,
		caffeinePerCup: 64.92296,
	},
	{
		name: "Black Tea",
		caffeinePerFlOz: 6,
		caffeinePerMl: 0.270512452,
		caffeinePerCup: 64.92296,
	},
	{
		name: "Green Tea",
		caffeinePerFlOz: 3.6,
		caffeinePerMl: 0.270512452,
		caffeinePerCup: 64.92296,
	},
	{
		name: "Herbal Tea",
		caffeinePerFlOz: 0,
		caffeinePerMl: 0,
		caffeinePerCup: 0,
	},
	{
		name: "Soda",
		caffeinePerFlOz: 2.791666667,
		caffeinePerMl: 0.405768678,
		caffeinePerCup: 97.38444,
	},
	{
		name: "Energy Drink",
		caffeinePerFlOz: 9.1875,
		caffeinePerMl: 0.270512452,
		caffeinePerCup: 64.92296,
	},
];

function populateDropdown() {
	const select = document.getElementById("myDropDown");
	for (let i = 0; i < drinks.length; i++) {
		const option = document.createElement("option");
		option.value = drinks[i].name;
		option.text = drinks[i].name;
		select.appendChild(option);
	}
}

const drinkList = [];

function showSelectedOption() {
	//This is for selecting which measuremnt is used for drink size------
	const dropdown = document.getElementById("myDropDown");
	const selectedDrink = drinks.find((drink) => drink.name === dropdown.value);
	const radioButtons = document.getElementsByName("radio2");

	let selectedMeasurement;
	for (let i = 0; i < radioButtons.length; i++) {
		if (radioButtons[i].checked) {
			selectedMeasurement = radioButtons[i].value;
			console.log(`Selected Amount` + selectedMeasurement);
			break;
		}
	}

	let caffeineContent = 0;
	switch (selectedMeasurement) {
		case "ml":
			caffeineContent = selectedDrink.caffeinePerMl;
			break;
		case "floz":
			caffeineContent = selectedDrink.caffeinePerFlOz;
			break;
		case "cup":
			caffeineContent = selectedDrink.caffeinePerCup;
			break;
		default:
			caffeineContent = 0;
	}
	drinkList.push({
		drink: selectedDrink.name,
		measurement: selectedMeasurement,
		caffeineContent: caffeineContent,
	});
	displayList();
	displayTotal();
}
function displayList() {
	const list = document.getElementById("drinkList");

	list.innerHTML = "";
	const groups = {};
	drinkList.forEach((drink) => {
		const key = `${drink.drink}-${drink.measurement}`;
		if (key in groups) {
			groups[key].quantity += 1;
			groups[key].caffeineContent += drink.caffeineContent;
		} else {
			groups[key] = {
				drink: drink.drink,
				measurement: drink.measurement,
				quantity: 1,
				caffeineContent: drink.caffeineContent,
			};
		}
	});
	for (const key in groups) {
		const group = groups[key];
		const listItem = document.createElement("li");
		listItem.textContent = `${group.drink} (${
			group.measurement
		}): ${group.caffeineContent.toFixed(2)} ${group.measurement} x ${
			group.quantity
		}`;
		listItem.style.marginLeft = "6px";
		listItem.style.listStyleType = "none";
		listItem.style.marginTop = "15px";
		listItem.style.marginRight = "15px";
		const removeButton = document.createElement("button");
		removeButton.textContent = "Delete";
		removeButton.style.backgroundColor = "red";
		removeButton.style.color = "white";
		removeButton.style.padding = "3px";
		removeButton.style.border = "none";
		removeButton.style.borderRadius = "5px";
		removeButton.style.marginLeft = "8px";
		// Add event listener to remove button
		removeButton.addEventListener("click", () => {
			// Find the index of the item to remove
			const index = drinkList.findIndex(
				(drink) =>
					drink.drink === group.drink && drink.measurement === group.measurement
			);
			// Remove the item from the drinkList array
			drinkList.splice(index, 1);
			// Update the display
			displayList();
			displayTotal();
		});
		listItem.appendChild(removeButton);
		list.appendChild(listItem);
	}
	const caffeineLimitDisplay = document.getElementById("caffeineLimit");
	const totalDisplay = document.getElementById("totalCaffeine");

	if (drinkList.length === 0) {
		caffeineLimitDisplay.innerHTML = "";
		totalDisplay.innerHTML = "";
		return;
	}
}
function displayTotal() {
	const total = document.getElementById("totalCaffeine");
	const amountOfDrinks = document.getElementById("numDrinks").value;
	const totalCaffeine = drinkList.reduce(
		(acc, drink) => acc + drink.caffeineContent,
		0
	);
	let newVal = totalCaffeine * amountOfDrinks;
	if (newVal == 0) {
		caffeineLimitDisplay.innerHTML = "";
	}
	console.log(newVal);
	total.textContent = `Total caffeine intake: ${newVal.toFixed(2)} mg`;

	const weightInput = document.getElementById("weight");
	const ageInput = document.getElementById("age");
	const caffeineLimitDisplay = document.getElementById("caffeineLimit");
	const weight = weightInput.value;
	const age = ageInput.value;

	let maxCaffeineLimit;
	if (age === "pregnant") {
		maxCaffeineLimit = 200;
	} else if (age === "olderadult") {
		maxCaffeineLimit = 300;
	} else if (age === "adults" || age === "youngadult") {
		maxCaffeineLimit = 400;
	} else {
		caffeineLimitDisplay.innerHTML = "Children under 12 should avoid coffee.";
		return;
	}
	const caffeineLimit = weight * 5.7;
	const caffeineLimitMessage = `Caffeine limit is ${caffeineLimit.toFixed(
		2
	)}mg , your max limit is ${maxCaffeineLimit}`;

	if (caffeineLimit > maxCaffeineLimit) {
		caffeineLimitDisplay.innerHTML = `${caffeineLimitMessage} You have exceeded the recommended maximum for selected category group.`;
	} else {
		caffeineLimitDisplay.innerHTML = caffeineLimitMessage;
	}
}
