const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find the file...');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(file, data, (err) => {
      if (err) reject('I could not write the file...');
      resolve('Success!!!');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Dog Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro('dog-img.txt', `Dog Image: ${res.body.message} \n\n`);
    console.log('Dog image saved to file');
  } catch (err) {
    console.log(err.message);
    console.log(err);
    throw err;
  }
};

getDogPic();

/*
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(data);
    console.log(`Dog Breed: ${data}`);

    return superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
  })
  .then((res) => {
    console.log(res.body.message);

    return writeFilePro(
      'dog-img.txt',
      `Dog Image: ${res.body.message} \n\n`
    );
  })
  .then(() => {
    console.log(
      'Dog image saved to file'
    );
  })
  .catch((err) => {
    console.log(err.message);
    console.log(err);
  });
*/
