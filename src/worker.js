const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const MASTER_MULTIADDR = '/ip4/54.191.195.43/tcp/4002/ws/ipfs/QmTQ1ttKqWxwWNTrqF1Qv2Pg92kDwL7bkrrPhXdgXwMTQN'
// const MASTER_MULTIADDR= '/dns4/ws-star.discovery.libp2p.io/wss/p2p-websocket-star/ipfs/QmTQ1ttKqWxwWNTrqF1Qv2Pg92kDwL7bkrrPhXdgXwMTQN'
// /ip4/172.29.38.17/tcp/4002/ipfs/QmTAzJVyka9KStvBiGcB2xs8ByBJRL34KeaM9atMEHUbjf
const DB_ADDRESS = '/orbitdb/zdpuAszhMs3RjB8QyBG1e2mDnB2pbUgQ2j1RVBqSExpDk5355/example881'
let db,orbitdb,identity;

class Orbit {

    onReplication = () => {
            db.events.on('replicated',()=>{
            console.log('Replication fired!!!')
            const latest = db.iterator({ limit: -1 }).collect()
            return { latest };
        })
    }
    
    startingIPFS = async () => {
        window.ipfs = new IPFS({
            // preload: { enabled: true , addresses: ['/dns4/node1.preload.ipfs.io/https'] },
            repo: './orbitdb/examples/ipfs',
            start: true,
            EXPERIMENTAL: {

                pubsub: true,
            },
            config: {
                "Bootstrap": [
                    MASTER_MULTIADDR
                    ,'/ip4/54.191.195.43/tcp/4001/ipfs/QmTQ1ttKqWxwWNTrqF1Qv2Pg92kDwL7bkrrPhXdgXwMTQN'
                  // Leave this blank for now. We'll need it later
                ]
            },
            relay: {
                enabled: true, // enable circuit relay dialer and listener
                hop: {
                    enabled: true // enable circuit relay HOP (make this node a relay)
                }
            }
            
        })

        // ipfs.on('error', (err) => console.error(err))
        await window.ipfs.ready
        // ipfs.on('ready', async () => {
            console.log(`ipfs ready.`)
            // await ipfs.swarm.connect(MASTER_MULTIADDR)
            try {
                console.log('Connecting master node',MASTER_MULTIADDR)
                // await window.ipfs.swarm.connect(MASTER_MULTIADDR)
                orbitdb = await OrbitDB.createInstance(window.ipfs);
                console.log('orbitdb 888888s')
                window.ipfs.on("replicated", () => {
                    console.log(`replication event fired`);
                })   
                // Make the DB public, so that anyone can write.
                // const options = {
                //     accessController: {
                //         write: ["*"]
                //     }
                // }
                console.log('orbit instantiated')
                console.log(orbitdb.identity.id)
                identity = orbitdb.identity.id
                console.log('connecting database')
                db = await orbitdb.eventlog(DB_ADDRESS);
                
                await db.load();
                console.log(db.id)
                console.log('####'+db)
                this.onReplication()
                return db
                
                // await db.events.on('replicated',()=>{console.log('Replication fired!!!')})
            } catch (e) {
                console.log('eroooor')
                console.error(e)
                process.exit(1)
            }
        // })
    }
    
    addingToDB = async (entry) => {
        // const index = Math.floor(Math.random() * creatures.length)
        // const userId = Math.floor(count+100)
        // count+=100
        try {
            // const entry = { avatar: creatures[index], userId: userId }
            // console.log(`Adding ${entry.avatar} ${entry.userId} to DB.`)
            await db.add(entry)
            await db.events.on('replicated',()=>{console.log('Replication fired@@@!!!')})
            const latest = db.iterator({ limit: -1 }).collect()
            // let output = ``
            // output += `[Latest Visitors]\n`
            // output += `--------------------\n`
            // output += `ID  | Visitor\n`
            // output += `--------------------\n`
            // output += latest.reverse().map((e) => e.payload.value.userId + ' | ' + e.payload.value.avatar + ')').join('\n') + `\n`
            console.log('worker addding to db')
            console.log(latest)
            return latest ;
        } catch (e) {
            console.error(e)
            process.exit(1)
        }
    }
    gettingId = () => {
        console.log(identity)
        return identity
    }
}
export default Orbit