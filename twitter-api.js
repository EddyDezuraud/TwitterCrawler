// Import the Twitter API client library
import { TwitterApi } from 'twitter-api-v2';

// Create a Twitter API client
const client = new TwitterApi({
    clientId: 'hrWyIxwBnKr1GLXqsGI1TgcR8',
    clientSecret: '2uKgqkYsn7sAp5yBRVZ4dcoZki23egWbDuoYn5O95fpfAe3W8k'
});


// Get the profile photo and name of the user with the userID `1234567890`
async function getUserProfile(userId) {
    const user = await client.v2.userByUsername(userId);
    return user;
}

// Export the getUserProfile function
export default getUserProfile;