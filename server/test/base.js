import server from '../../server';
import chai from 'chai';
import chaiHttp from 'chai-http';
let should = chai.should();
chai.use(chaiHttp);

describe('basic tests', () => {
    let user = Math.random().toString(36).substring(7);

    it('check auth middleware', (done) => {
        chai.request(server)
            .get('/profile')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    });

    it('register', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: user,
                password: 'test'
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

    it('login', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: user,
                password: 'test'
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

    it('login and profile', (done) => {
        var agent = chai.request.agent(server)
        agent
            .post('/login')
            .send({
                username: user,
                password: 'test'
            })
            .end((err, res) => {
                res.should.have.status(200);
                agent.get('/profile').end((er, re) => {
                    re.should.have.status(200);
                    done();
                });
            })
    })
});
