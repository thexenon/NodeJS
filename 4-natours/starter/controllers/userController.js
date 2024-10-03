const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/users.json`
  )
);

exports.getAllUsers = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users
    }
  });
};

exports.getSingleUser = (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  const user = users.find(el => el.id === id);

  // //   if (id > users.length) {
  if (!user) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    // results: users.length,
    data: {
      user
    }
  });
};

exports.addNewUser = (req, res) => {
  //   console.log(req.body);
  const newID = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newID }, req.body);
  users.push(newUser);
  fs.writeFile(
    `${__dirname}/dev-data/data/users-simple.json`,
    JSON.stringify(users),
    err => {
      res.status(201).json({
        status: 'sucess',
        data: {
          user: newUser
        }
      });
    }
  );
};

exports.updateUser = (req, res) => {
  const id = req.params.id;
  const user = users.find(el => el.id === id);

  //   if (id > users.length) {
  if (!user) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: '<Update is here...>'
    }
  });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  const user = users.find(el => el.id === id);

  //   if (id > users.length) {
  if (!user) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};
