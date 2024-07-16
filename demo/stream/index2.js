const Koa = require('koa');
const KoaRouter = require('koa-router');
const path = require('path');
const koaStatic = require('koa-static');
const { PassThrough } = require('stream');

const app = new Koa();
const router = new KoaRouter();

router.get('/open-ai/sendMsg', async (ctx) => {
  ctx.type = 'text/event-stream';
  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  const streamData = new PassThrough();
  ctx.body = streamData;
  // streamData.write(`data: 123\n\n`);
  let i = 1;
  let timer = setInterval(() => {
    if (i === 8) {
      streamData.write(`data: 444\n\n`);
      clearInterval(timer);
      // setTimeout(() => {
      //   streamData.write(`data: [DONE]\n\n`);
      // }, 3000);
    } else {
      streamData.write(`data: ${i}\n\n`);
      // streamData.write(
      //   `event: userconnect\ndata: {"username": "bobby", "time": "02:33:48"}\n\n`
      // );
    }
    i++;
  }, 500);
});

app.use(new koaStatic(path.resolve(__dirname, './fe')));
app.use(router.routes()).use(router.allowedMethods());
app.listen(8087, () => console.log('listening on 8087'));
