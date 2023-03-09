var chai = require('chai')
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var requester = chai.request('http://localhost:8000').keepOpen()

  it('worked as expected', function(done) { // <= Pass in done callback
    chai.request('http://localhost:8000')
    .get('/employees/list/63fb4cbc80ecd7d359ae290f')
    .end(function(err, res) {
    //  expect(res).to.have.status(123);
      done();                               // <= Call done to signal callback end
    });
  });
  
  it('succeeds silently!', function(done) {   // <= No done callback
    chai.request('http://localhost:8000')
    .post('/franchises/add_Franchise').send({FranchiseName:"franchise3"})
    .end(function(err, res) {
     // expect(res).to.have.status(123); 
      done();   // <= Test completes before this runs
    });
  });
