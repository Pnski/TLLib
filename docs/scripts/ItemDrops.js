// import * as droptable from './TLItemDrop_AGS_126122810.json'

const loadJson = async (path) => {
	const response = await fetch(path);
	if (!response.ok) {
		throw new Error(`Failed to load JSON from ${path}: ${response.statusText}`);
	}
	return response.json();
};

const inputData = await loadJson("scripts/TLItemDrop_AGS_126122810.json");
// console.log(inputData[0].Rows);

function renderItemTable() {
	const iDoc = document.getElementById("ItemCalc");
	if (!iDoc) {
		console.error("Element with id 'ItemCalc' not found");
		return;
	}

	const createRow = (title, dropItems) => {
		const tr = document.createElement("tr");
		const th = document.createElement("th");
		th.innerText = title;
		tr.appendChild(th);

		// Ensure dropItems is iterable (e.g., an array)
		const items = Array.isArray(dropItems) ? dropItems : Object.values(dropItems);

		items.forEach((itemGroup) => {
			Object.values(itemGroup).forEach((item) => {
				const td = document.createElement("td");
				td.innerText = item.ItemId;
				tr.appendChild(td);
			});
		});

		return tr;
	};

	Object.values(inputData[0].Rows).forEach((row) => {
		if (row.Name.toLowerCase().includes("test")) {
			return;
		}

		const table = document.createElement("table");
		const caption = document.createElement("caption");
		caption.innerText = row.Name;
		table.appendChild(caption);

		table.appendChild(createRow("Normal", row.NormalDropItems));
		table.appendChild(createRow("Night", row.NightDropItems));
		table.appendChild(createRow("Rain", row.RainDropItems));

		iDoc.appendChild(table);
	});
}

renderItemTable();
