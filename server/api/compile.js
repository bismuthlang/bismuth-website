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
    pack.entry({ name: 'input.txt', gid: 1001, uid: 1001 }, body.code);
    pack.finalize();

    let _container = await (await docker.container.create({ Image: 'pl-repl' })).start();


    await _container.fs.put(pack, { path: '/home/my-service/Sandbox' });

    let stream = await (await _container.exec.create({
        AttachStdout: false,
        AttachStderr: true,
        Cmd: ['./compiler', 'input.txt', '--compile=clang', '--demo-mode'],
        // AttachStdout: true,
        // AttachStderr: true,
        // // Cmd: ['ls', '-al']
    })).start({ Detach: false })

    let compilePromise = new Promise(async function (myResolve, myReject) {
        try {
            let compileData = await promisifyStream(stream)
            if (compileData.toString().length > 0) {
                myResolve(compileData.toString().substring(8)); //https://github.com/AgustinCB/docker-api/issues/71
            }
            else {
                let runStream = await (await _container.exec.create({
                    AttachStdout: true,
                    AttachStderr: true,
                    Cmd: ['./a.out']
                })).start({ Detach: false })

                let runData = await promisifyStream(runStream);

                myResolve("Compiled Successfully. Output: \n" + runData.toString().substring(8)); //https://github.com/AgustinCB/docker-api/issues/71
            }

        } catch (err) {
            console.log(err);
            myReject("Error")
        }
    });


    let ans = await Promise.race([compilePromise, new Promise((resolve, reject) => {
        setTimeout(resolve, 2500, 'Execution took too long (Timed out after 2.5 seconds).');
    })])

    await _container.kill();

    return { api: 'works', data: ans }
})