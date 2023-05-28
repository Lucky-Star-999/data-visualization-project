async function getJSONData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('An error occurred while loading the data: ', error);
        throw error;
    }
}

