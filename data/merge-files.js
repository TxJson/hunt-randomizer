const fs = require('fs');

const ITEMS_PATH = `${__dirname}/items`;
const WEAPONS_PATH = `${ITEMS_PATH}/weapons`;
const TOOLS_PATH =  `${ITEMS_PATH}/tools`;
const CONSUMABLES_PATH = `${ITEMS_PATH}/consumables`;

const skipItems = ['template'];

const getJson = (path, skip = true) => {

    // Get all JSON Files
    const getFiles = (path, skip) => {
        const files = fs.readdirSync(path);
        const filteredFiles = files.filter((file) => file.includes('.json'));
    
        const filterFiles = (files) => {
            // Filter out items in skipItems array
            return files.filter((file) => {
                const name = file.split('.json').shift();
                return (!skipItems.includes(name));
            });
        }

        return skip ? filterFiles(filteredFiles) : filteredFiles;
    }

    const files = getFiles(path, skip);
    const data = files.map((file) => {
        const fileData = fs.readFileSync(`${path}/${file}`);
        return JSON.parse(fileData);
    });

    return data;
};

const writeData = (data, fileName = 'hunt-data') => {
    const json = JSON.stringify(data);
    if (json) {
        const path = `${__dirname}/${fileName}.json`;
        fs.writeFileSync(path, json, 'utf8');
        console.log(`Data was written to ${path}.`);

    }
}

const adjustData = (data) => {
    const obj = {};
    data.forEach((item) => {
        const name = item.name.toLowerCase().replace(/\s/g, '_');
        obj[name] = item;
    });
    return obj;
}

const getData = (path) => {
    const json = getJson(path);
    return adjustData(json);
}

const data = {
    items: {
        weapons: getData(WEAPONS_PATH),
        tools: getData(TOOLS_PATH),
        consumables: getData(CONSUMABLES_PATH)
    }
}

writeData(data);