const Koa = require('koa');
const axios = require('axios');

const url = 'https://609a76db0f5a13001721b1e9.mockapi.io/api/v1/users';
const PORT = 3000;
const app = new Koa();

const listenFunc = () => console.log('Server is started');
const getUsers = () => axios.get(url).then(res => res.data);

const routes = {
    'health' : () => ({ msg: 'Server is ON'}),
    'users' : () => getUsers(),
    'user' : async (id) => {
        const d = await getUsers();
        const user = d.find(u => u.id == id);
        return user;
    },
    'error' : () => ({ msg: 'Route is not supported'}),
}

const mwRouter = async (ctx, next) => {
    const [, path, id] = ctx.path.split('/');
    ctx.state.func = routes[path] || routes['error'];
    ctx.state.id = id;
    console.log('ROUTER: ', path);
    await next();
    console.log('ROUTER END');
}

app.use(mwRouter);
app.use(async ctx => {
    ctx.body = await ctx.state.func(ctx.state.id);
});

app.listen(PORT, listenFunc);