function imgToCabinet(url) {
    var response = nlapiRequestURL(url);
    var img = response.body;

    var file = nlapiCreateFile('test2.jpg', 'JPGIMAGE', img)

    file.setFolder(-4);
    file.setEncoding('UTF-8')



    var fileId = nlapiSubmitFile(file);

}

imgToCabinet('https://i.imgur.com/gjGZUJy.jpg')