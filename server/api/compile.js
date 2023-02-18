// const tar = require('tar-stream'); // Needed to convert files to buffers
import tar from 'tar-stream';
import { Docker } from "node-docker-api";

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

const promisifyStream = (stream) => new Promise((resolve, reject) => {
    let chunks = [];
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => {
        //   console.log(chunks)
        resolve(Buffer.concat(chunks));
    })
    stream.on('error', reject)
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    //FIXME: error handle if not present!

    var pack = tar.pack()
    pack.entry({ name: 'input.txt' }, body.code);
    pack.finalize();

    let _container = await (await docker.container.create({ Image: 'pl-repl' })).start();


    await _container.fs.put(pack, { path: '/home' });

    let stream = await (await _container.exec.create({
        AttachStdout: false,
        AttachStderr: true,
        Cmd: ['./compiler', 'input.txt', '--compile=clang']
    })).start({ Detach: false })


    let ans = "";
    try {
        let compileData = await promisifyStream(stream)
        if (compileData.toString().length > 0) {
            // console.log()
            ans = compileData.toString().substring(8);
        }
        else {
            let runStream = await (await _container.exec.create({
                AttachStdout: true,
                AttachStderr: true,
                Cmd: ['./a.out']
            })).start({ Detach: false })

            let runData = await promisifyStream(runStream);

            ans = runData.toString();
            // console.log();
        }

    } catch (err) {
        console.log(err);
    }

    await _container.kill();

    return { api: 'works', data: ans }
})