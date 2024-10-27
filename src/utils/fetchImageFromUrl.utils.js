import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchImageFromUrl = async (url) => {
    try {
        // Make a request to the URL
        const { data } = await axios.get(url);

        // Load the HTML into Cheerio
        const $ = cheerio.load(data);

        // Select the image element (assuming there's only one)
        const imgSrc = $('img').attr('src');

        return imgSrc; // Return the image source URL
    } catch (error) {
        console.error('Error fetching image:', error);
        return null; // Return null in case of an error
    }
};
