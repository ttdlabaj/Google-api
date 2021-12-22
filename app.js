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
    } catch(err) {
        console.log(err)
    }
}

// get additional information about books from books array
const getFinalList = async (books) => {
    const booklist = await books.map((r, index) =>({
        'id': index,
        'author': r.volumeInfo.authors,        
        'title': r.volumeInfo.title,        
        'publisher': r.volumeInfo.publisher       
    }))
    console.log(booklist)
    addBookToList(booklist)    
    return booklist
}
// Find book by ID and add book to readingList.txt
addBookToList = async (booklist) => {
    let readinglist = []
    const idNum = prompt("Enter ID of book to add to reading list: ");
    for (let i=0; i < booklist.length; i++) {
        if (idNum == booklist[i]['id']) {
            readinglist.push(booklist[i])            
        }
        
    }
    const cleanedList = `Title: ${readinglist[0].title} \nAuthor: ${readinglist[0].author} \nPublisher: ${readinglist[0].publisher} \n`

    await fs.appendFile('readingList.txt', cleanedList, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("\nBooks in reading list:\n",
            fs.readFileSync("readingList.txt", "utf8"));
        }
    })
}

console.log(getBooks())




