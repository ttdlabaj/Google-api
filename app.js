const prompt = require("prompt-sync")();
const axios = require('axios');
const fs = require('fs');

const getBooks = async () => {
    console.log('Welcome to Tanya\'s book app!')

    //enter search term
    const keyword = prompt("Enter keyword to search: "); 

    //fetch books from api using axios
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${keyword}&maxResults=5`)
        const { data } = response        
        //display books matching query
        const books = (data.items) 
        getFinalList(books)
        return books
    } catch(err) {
        console.log(err)
    }
}

// get additional information about books from books array
const getFinalList = (books) => {
    const booklist = books.map((r, index) => ({
        'id': index,
        'author': r.volumeInfo.authors,        
        'title': r.volumeInfo.title,        
        'publisher': r.volumeInfo.publisher       
    }))
    for (let i = 0; i < booklist.length; i++) {
        console.log(`\n\nID: ${booklist[i]['id']} \nTitle: ${booklist[i]['title']} \nAuthor: ${booklist[i]['author']} \nPublisher: ${booklist[i]['publisher']}`)
    }

    addBookToList(booklist)    
    return booklist
}
let readinglist = []
// Find book by ID and add book to readingList.txt
addBookToList = (booklist) => {

    let idNum = prompt("Enter ID of book to add to reading list: ");
    if (idNum === " " || idNum === "") {
        console.log('Enter a valid number: It is not in the search results.')
        idNum = prompt("Enter ID of book to add to reading list: ");
    }

    if (idNum <= 0 || idNum > booklist[booklist.length - 1]['id']) {
        console.log('Enter a valid number: It is not in the search results.')
        idNum = prompt("Enter ID of book to add to reading list: ");
    }

    for (let i=0; i < booklist.length; i++) {
        if (idNum == booklist[i]['id']) {
            readinglist.push(booklist[i])
        }     
    }

    const cleanedList = `Title: ${readinglist[0].title} \nAuthor: ${readinglist[0].author} \nPublisher: ${readinglist[0].publisher} \n`

    fs.appendFile('readingList.txt', cleanedList, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("\nBooks in reading list:\n\n",
            fs.readFileSync("readingList.txt", "utf8"));
        }
    })
}

console.log(getBooks())

module.exports = {
    getBooks,
    getFinalList,
    addBookToList,
};