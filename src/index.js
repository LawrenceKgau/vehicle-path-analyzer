const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// ======================
// 1. UTILITY FUNCTIONS
// ======================
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ======================
// 2. DATA LOADING
// ======================
function loadPathData() {
    try {
        const data = require(path.join(__dirname, '../data/PathTravelled.json'));
        if (!Array.isArray(data)) throw new Error('Invalid JSON format');
        return data;
    } catch (error) {
        throw new Error(`Failed to load path data: ${error.message}`);
    }
}

async function loadStores() {
    return new Promise((resolve, reject) => {
        const stores = [];
        const csvPath = path.join(__dirname, '../data/storesCopy.csv');
        
        fs.createReadStream(csvPath)
            .pipe(csv({
                separator: ';',
                mapHeaders: ({ header }) => header.replace(/^\uFEFF/, '').trim(),
                mapValues: ({ value }) => value.trim()
            }))
            .on('headers', (headers) => {
                if (!headers.includes('store') || !headers.includes('latitude') || !headers.includes('longitude')) {
                    reject(new Error('CSV missing required columns'));
                }
            })
            .on('data', (row) => {
                try {
                    const lat = parseFloat(row.latitude);
                    const lon = parseFloat(row.longitude);
                    if (isNaN(lat) || isNaN(lon)) {
                        throw new Error(`Invalid coordinates for store: ${row.store}`);
                    }
                    
                    stores.push({
                        name: row.store,
                        latitude: lat,
                        longitude: lon,
                        minDistance: Infinity,
                        closestTimestamp: null
                    });
                } catch (error) {
                    reject(error);
                }
            })
            .on('end', () => {
                if (stores.length === 0) reject(new Error('No stores found in CSV'));
                resolve(stores);
            })
            .on('error', reject);
    });
}

// ======================
// 3. CORE LOGIC
// ======================
async function analyzePath() {
    try {
        // Load data
        const pathData = loadPathData();
        const stores = await loadStores();

        // ======================
        // TASK 1: Find closest store
        // TASK 2: Find furthest store timestamp
        // ======================
        stores.forEach(store => {
            pathData.forEach(point => {
                const distance = haversine(
                    store.latitude,
                    store.longitude,
                    point.latitude,
                    point.longitude
                );
                
                if (distance < store.minDistance) {
                    store.minDistance = distance;
                    store.closestTimestamp = point.timeStamp;
                }
            });
        });

        const closestStore = stores.reduce((prev, current) => 
            prev.minDistance < current.minDistance ? prev : current
        );

        const furthestStore = stores.reduce((prev, current) => 
            prev.minDistance > current.minDistance ? prev : current
        );

        // ======================
        // TASK 3: Total distance traveled
        // ======================
        let totalDistance = 0;
        for (let i = 1; i < pathData.length; i++) {
            totalDistance += haversine(
                pathData[i-1].latitude,
                pathData[i-1].longitude,
                pathData[i].latitude,
                pathData[i].longitude
            );
        }

        // ======================
        // TASK 4: Highest speed
        // ======================
        const maxSpeed = Math.max(...pathData.map(p => p.speed));

        // ======================
        // RESULTS
        // ======================
        return {
            closestStore: {
                name: closestStore.name,
                distance: closestStore.minDistance,
                timestamp: closestStore.closestTimestamp
            },
            furthestStoreTimestamp: furthestStore.closestTimestamp,
            totalDistance,
            maxSpeed
        };

    } catch (error) {
        console.error('Analysis failed:', error.message);
        process.exit(1);
    }
}

// ======================
// 4. MAIN EXECUTION
// ======================
(async () => {
    try {
        const results = await analyzePath();
        
        console.log('1. Closest Store:');
        console.log(`   Name: ${results.closestStore.name}`);
        console.log(`   Distance: ${results.closestStore.distance.toFixed(2)} meters`);
        console.log(`   Timestamp: ${results.closestStore.timestamp}`);

        console.log('\n2. Timestamp when first approached furthest store:');
        console.log(`   Timestamp: ${results.furthestStoreTimestamp}`);

        console.log('\n3. Total Distance Traveled:');
        console.log(`   ${(results.totalDistance / 1000).toFixed(2)} km`);

        console.log('\n4. Highest Speed Recorded:');
        console.log(`   ${results.maxSpeed} km/h`);

    } catch (error) {
        console.error('Fatal error:', error.message);
        process.exit(1);
    }
})();