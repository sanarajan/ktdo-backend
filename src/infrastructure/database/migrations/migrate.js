const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') });

const url = process.env.MONGO_URI || 'mongodb://localhost:27017/driver-app';
const dbName = url.split('/').pop().split('?')[0] || 'driver-app';

async function main() {
    const client = new MongoClient(url);

    try {
        console.log('Connecting to', url);
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection('users');

        console.log('Updating fields...');
        const result = await collection.updateMany(
            {},
            {
                $rename: {
                    "state": "workingState",
                    "district": "workingDistrict"
                }
            }
        );

        console.log(`Updated ${result.modifiedCount} documents`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main();
