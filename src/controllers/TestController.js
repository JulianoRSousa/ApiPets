
module.exports = {
 TestConsole(req, res){
  console.log('date.now(): ', Date.now())
  let date = new Date;
  let dateNow = Date.now();
  console.log('date: ', date)
  console.log('date.now: ', dateNow)


  const post = {
    postedAt: Date.now(),
  };
  console.log(post)

  return res.json(post);
}
};
