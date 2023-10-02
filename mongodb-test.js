const express = require('express');
const app = express();
const port = 3000;

const { MongoClient } = require('mongodb');
const dbUri = 'mongodb+srv://wpicsstudent:WpiCSPassword1@cluster0.fpn7dla.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';

app.get('/', (request, response) => {
    response.send('Hello World!');
});

app.listen(port, async () => {
    console.log(`App listening on port ${port}`);

    const client = new MongoClient(dbUri);
    await client.connect();
    /*
    await createNewListing(client,
        {
            name: 'Newell and Laurie\'s apartment',
            summary: 'A small, cozy apartment with separate bathrooms on each bedroom to avoid fights',
            bedrooms: 2,
            bathrooms: 2
        });
    await createMultipleListings(client,
        [
            {
                name: 'Newell and Laurie\'s apartment',
                summary: 'A small, cozy apartment with separate bathrooms on each bedroom to avoid fights',
                bedrooms: 2,
                bathrooms: 2
            },
            {
                name: 'Ian\'s house',
                summary: 'A cozy, fun house in Sturbridge with two nice dogs',
                bedrooms: 3,
                bathrooms: 1
            },
            {
                name: 'Ian\'s dorm',
                summary: 'A 4-bedroom suite in Faraday Hall with a kitchen and a bar',
                bedrooms: 4,
                bathrooms: 1
            },
            {
                name: 'Laurie\'s house',
                summary: 'A very nice house in Monroe, CT with a well-kept yard',
                bedrooms: 4,
                bathrooms: 2
            }
        ]);
    */

    await findOneListingByName(client, 'Newell and Laurie\'s apartment');
    await findOneListingByName(client, 'Akansha\'s place');
    await findAllWithName(client, 'Newell and Laurie\'s apartment');

    //await updateWithName(client, 'Newell and Laurie\'s apartment', { bedrooms: 7 });
    await upsertWithName(client, 'Laurie\'s house', { bedrooms: 3 });
    await upsertWithName(client, 'Akansha\'s place',
        {
            name: 'Akansha\'s place',
            summary: 'A grand house owned by strict Indian parents',
            bedrooms: 5,
            bathrooms: 3
        });
    await updateAllWithName(client, 'Newell and Laurie\'s apartment', { bedrooms: 1000 });

    await findEverything(client);

    await deleteAllWithName(client, 'Newell and Laurie\'s apartment');

    await findEverything(client);
    
    await client.close();
});

async function connectToDB(client) {
    await client.connect();
    let databasesList = await client.db().admin().listDatabases();
    console.log('Databases: ');
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    client.close();
    console.log('closed connection successfully');
}

async function createNewListing(client, newListing) {
    const result = await client.db('sample_airbnb').collection('listingAndReviews').insertOne(newListing);
    console.log(`New listing created with id ${result.insertedId}`);
}

async function createMultipleListings(client, newListings) {
    client = new MongoClient(dbUri);
    const result = await client.db('sample_airbnb').collection('listingAndReviews').insertMany(newListings);
    console.log(`Inserted ${result.insertedCount} new listings.`);
    console.log(result.insertedIds);
}

async function findOneListingByName(client, nameOfListing) {
    const result = await client.db('sample_airbnb').collection('listingAndReviews').findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found listing with name ${nameOfListing}:`);
        console.log(result);
    }
    else {
        console.log(`Failed to find listing with name ${nameOfListing}`);
    }
}

async function findAllWithName(client, name) {
    const result = await client.db('sample_airbnb').collection('listingAndReviews').find({ name: name }).toArray();

    if (result) {
        console.log(`Found ${result.length} listings named ${name}:`);
        console.log(result);
    }
    else {
        console.log(`Failed to find result named ${name}`);
    }
}

async function findEverything(client) {
    const result = await client.db('sample_airbnb').collection('listingAndReviews').find({}).toArray();

    if (result) {
        console.log(`Found ${result.length} listings:`);
        console.log(result);
    }

    else {
        console.log('Found no results.');
    }
}

async function updateWithName(client, name, updatedItem) {
    const result = await client
        .db('sample_airbnb')
        .collection('listingAndReviews')
        .updateOne({ name: name }, { $set: updatedItem });
    
    console.log(`${result.matchedCount} documents matched the query.`);
    console.log(`${result.modifiedCount} documents were modified.`);
}

async function upsertWithName(client, name, updatedItem) {
    const result = await client
        .db('sample_airbnb')
        .collection('listingAndReviews')
        .updateOne({ name: name }, { $set: updatedItem }, { upsert: true });
    
    console.log(`${result.matchedCount} documents matched the query.`)
    console.log(`${result.modifiedCount} documents were modified.`);
}

async function updateAllWithName(client, name, updatedItem) {
    const result = await client
        .db('sample_airbnb')
        .collection('listingAndReviews')
        .updateMany({ name: name }, { $set: updatedItem });
    
    console.log(`${result.matchedCount} documents matched the query`);
    console.log(`${result.modifiedCount} documents were modified.`);
}

async function deleteAllWithName(client, name) {
    const result = await client
        .db('sample_airbnb')
        .collection('listingAndReviews')
        .deleteMany({ name: name });
    
    console.log(`${result.deletedCount} documents were deleted.`);
}