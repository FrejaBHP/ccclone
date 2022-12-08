let cookies = 0;
let timeCounter = 0;
let time = 0;

let baseClickValue = 1;
let clickMultiplier = 1;
let cookieMultiplier = 1;
let totalClickValue = 1;
let noOfClicks = 0;

let baseIncome = 0;
let totalIncome = 0;

const Building0 = {idNo: 0, name: "Cursor", cost: 15, baseIncome: 0.1, amount: 0, multi: 1, shown: false, beskrivelse: "Klikker automatisk for dig"};
const Building1 = {idNo: 1, name: "Bedstemor", cost: 100, baseIncome: 0.5, amount: 0, multi: 1, shown: false, beskrivelse: "En kær bedstemor til at bage Cookies for dig"};

const Buildings = [Building0, Building1];

const Upgrade0 = {idNo: 0, name: "Click Hard", cost: 20, bought: false, shown: false, image: "Files/cursor.png", beskrivelse: "Fordobler dine Cookies per klik."};
const Upgrade1 = {idNo: 1, name: "Click 2: Click Harder", cost: 100, bought: false, shown: false, image: "Files/cursor.png", beskrivelse: "Fordobler dine Cookies per klik. Igen."};
const Upgrade2 = {idNo: 2, name: "Click 3: Click Hardest", cost: 500, bought: false, shown: false, image: "Files/cursor.png", beskrivelse: "Fordobler dine Cookies per klik. Igen. Igen."};
const Upgrade3 = {idNo: 3, name: "Klik Assistance", cost: 50, bought: false, shown: false, image: "Files/cursor.png", beskrivelse: "Fordobler dine Cursors indkomst."};
const Upgrade4 = {idNo: 4, name: "For Mange Småkager", cost: 250, bought: false, shown: false, image: "Files/cookie.png", beskrivelse: "Fordobler din indkomst."};
const Upgrade5 = {idNo: 5, name: "Kæmpe Kageruller", cost: 500, bought: false, shown: false, image: "Files/grandma.png", beskrivelse: "Fordobler dine Bedstemødres indkomst."};

const Upgrades = [Upgrade0, Upgrade1, Upgrade2, Upgrade3, Upgrade4, Upgrade5];

const Incomes = new Array(Buildings.length);

setInterval(GenerateCookies, 100);

function ClickCookie() { //kører hver gang småkagen klikkes
    noOfClicks++;
    cookies += totalClickValue;
    UpdateStatClicks(noOfClicks);
    UpdateCookies();
}

function BuyBuilding(no) { //køber bygning
    if (cookies >= Buildings[no].cost) {
        cookies -= Buildings[no].cost;
        Buildings[no].cost *= 1.15;
        Buildings[no].amount++;
        UpdateBuildingDescriptions(no);
    }
}

function UpdateBuildingDescriptions(buildingNo) { //Genskriver bygningernes info
    let bygning = document.getElementById(("building" + buildingNo));
    let income = (Buildings[buildingNo].baseIncome * Buildings[buildingNo].multi * cookieMultiplier);
    let bygningsTooltip = (Buildings[buildingNo].name +
        "\nIndkomst: " + income +
        "\nPris: " + Buildings[buildingNo].cost.toFixed(2) +
        "\nAntal: " + Buildings[buildingNo].amount +
        "\n\n" + Buildings[buildingNo].beskrivelse)
    bygning.innerText = bygningsTooltip;
    UpdateStatBuildingWorth(buildingNo, income, Buildings[buildingNo].amount);
}

function GenerateCookies() { //generelt gameplay loop hvor der tælles 10 gange i sekundet og genereres passiv inkomst
    let i = 0;
    baseIncome = 0;
    Buildings.forEach(bygning => {
        if  (bygning.amount != 0) {
            Incomes[i] = bygning.baseIncome * bygning.amount * bygning.multi;
            baseIncome += Incomes[i];
            i++;
        }
        else {
            Incomes[i] = 0;
            i++;
        }
    });

    totalIncome = baseIncome * cookieMultiplier;
    cookies += totalIncome / 10;
    UpdateCookies();
    CountTime();
    
}

function CountTime() { //Tæller hvert 10. tiendedel af et sekund for et helt sekund
    timeCounter++;

    if (timeCounter > 9)
    {
        time++;
        document.getElementById("statTimeDisplay").innerText = time;
        timeCounter = 0;

        if (time % 20 === 0)
    {
        NewsAnchor();
    }
    }
}

function UpdateIncomeValues() { //opdaterer tekst på skærmen
    UpdateClickValue();

    for (i = 0; i < Buildings.length; i++) {
        UpdateBuildingDescriptions(i);
    }
}

function UpdateClickValue() {
    totalClickValue = (baseClickValue * clickMultiplier * cookieMultiplier);
    UpdateStatClickWorth(totalClickValue);
}

function UpdateCookies() { //opdaterer displayet på siden
    document.getElementById("cookiesNoDisplay").innerText = (String(cookies.toFixed(2))); 
    document.getElementById("cookiesPerSecondDisplay").innerText = (String(totalIncome.toFixed(2)));
    FetchUpgrades();
    FetchBuildings();
}

function FetchUpgrades() { //tjekker efter nye opgraderinger
    for (i = 0; i < Upgrades.length; i++) {
        if (cookies >= Upgrades[i].cost && Upgrades[i].shown === false) {
            Upgrades[i].shown = true;
            AddUpgrade(i);
            i++;
        }
    }
}

function FetchBuildings() { //tjekker efter nye bygninger
    for (i = 0; i < Buildings.length; i++) {
        if (cookies >= Buildings[i].cost && Buildings[i].shown === false) {
            Buildings[i].shown = true;
            AddBuilding(i);
            AddStat(i);
            i++;
        }
    }
}

function AddUpgrade(upgradeNo) { //opsætter og tilføjer knapper til opgraderinger
    let newButton = document.createElement("button");
    newButton.id = ("upgrade" + upgradeNo);
    newButton.className = "UpgradeButton";
    newButton.onclick=function(){Upgrade(upgradeNo);}
    
    let opgraderingsTooltip = (Upgrades[upgradeNo].name +
        "\nPris: " + Upgrades[upgradeNo].cost +
        "\n\n" + Upgrades[upgradeNo].beskrivelse)
    newButton.setAttribute("data-tooltip", opgraderingsTooltip);
    document.getElementById("upgrades").append(newButton);

    let buttonImage = document.createElement("img");
    buttonImage.setAttribute("src", Upgrades[upgradeNo].image);
    document.getElementById(newButton.id).append(buttonImage);

}

function RemoveUpgrade(upgradeNo) { //fjerner knapper til opgraderinger
    let upgradeButton = document.getElementById(("upgrade" + upgradeNo));
    upgradeButton.parentNode.removeChild(upgradeButton);
}

function Upgrade(upgradeNo) { //hvis der er råd, opgrades ud fra valgt opgradering
    if (cookies >= Upgrades[upgradeNo].cost && Upgrades[upgradeNo].bought == false) {
        switch(true) {
            case upgradeNo === 0:
                clickMultiplier *= 2;
                break;

            case upgradeNo === 1:
                clickMultiplier *= 2;
                break;

            case upgradeNo === 2:
                clickMultiplier *= 2;
                break;

            case upgradeNo === 3:
                Building0.multi *= 2;
                break;

            case upgradeNo === 4:
                cookieMultiplier *= 2;
                break;

            case upgradeNo === 5:
                Building1.multi *= 2;
                break;
            default: break;
        }
        Upgrades[upgradeNo].bought == true;
        cookies -= Upgrades[upgradeNo].cost;
        UpdateIncomeValues();

        RemoveUpgrade(upgradeNo);
        UpdateCookies();
    } 
}

function UpdateStatClicks(tal) { //opdaterer tal i midten
    document.getElementById("statClicksDisplay").innerText = (String(tal)); 
}

function UpdateStatClickWorth(tal) { //opdaterer tal i midten
    document.getElementById("statClickWorthDisplay").innerText = (String(tal));
}

function UpdateStatBuildingWorth(bygning, indkomst, mængde) { //opdaterer tal i midten
    switch(true) {
        case bygning === 0:
            document.getElementById("statCursorDisplay").innerText = (String((indkomst * mængde).toFixed(2)));
            break;
        case bygning === 1:
            document.getElementById("statGrandmaDisplay").innerText = (String((indkomst * mængde).toFixed(2)));
            break;

        default: 
            console.log("Hov");
            break;
    }
}

function AddBuilding(buildingNo) { //opsætter og tilføjer knapper til opgraderinger
    let newButton = document.createElement("button");
    newButton.id = ("building" + buildingNo);
    newButton.className = "BuildingButton";
    newButton.onclick=function(){BuyBuilding(buildingNo);}
    
    let income = (Buildings[buildingNo].baseIncome * Buildings[buildingNo].multi * cookieMultiplier);
    let bygningsTooltip = (Buildings[buildingNo].name +
        "\nIndkomst: " + income +
        "\nPris: " + Buildings[buildingNo].cost.toFixed(2) +
        "\nAntal: " + Buildings[buildingNo].amount +
        "\n\n" + Buildings[buildingNo].beskrivelse)
    newButton.innerText = bygningsTooltip;
    document.getElementById("buildings").append(newButton);
}

function AddStat(tal) { //tiljører ny statistik til midten
    let nyStatistik = document.createElement("p");
    nyStatistik.id = ("stat" + Buildings[tal].name);
    nyStatistik.className = "Stat";
    switch(true) {
        case tal === 0:
            nyStatistik.innerHTML = 'Total Cursor indkomst: <span id="statCursorDisplay">0</span>';
            break;
        case tal === 1:
            nyStatistik.innerHTML = 'Total Bedstemor indkomst: <span id="statGrandmaDisplay">0</span>';
            break;
        default: break;
    }
    document.getElementById("stats").append(nyStatistik);
}

let nyhed0 = "Lokale danskere bryder kopilove vedrørende populært browserspil.";
let nyhed1 = "Verden observeret til at være lavet af småkager.";
let nyhed2 = "Lokal studerende sidder fast i CSS - mere klokken 20."
let nyhed3 = "Populært markupsprog HTML udvikler selvbevidsthed."
let nyhed4 = "Cascading Style Sheets udretter egen vilje, flytter elementer som det lyster."
const News = [nyhed0, nyhed1, nyhed2, nyhed3, nyhed4];

let nyhedNr = (Math.floor(Math.random() * News.length));
NewsAnchor();

function NewsAnchor() { // :)
    let nyNyhedNr = nyhedNr;
    while(nyNyhedNr === nyhedNr) {
        nyNyhedNr = (Math.floor(Math.random() * News.length));
    }
    nyhedNr = nyNyhedNr;
    let nyhed = News[nyNyhedNr];
    document.getElementById("news").innerText = nyhed;
}

UpdateClickValue(); // instantierer klikværdi
